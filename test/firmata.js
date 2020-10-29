global.IS_TEST_MODE = true;
const mocks = require('mock-firmata');
const MockFirmata = mocks.Firmata;
const MockSerialPort = mocks.SerialPort;

const sinon = require('sinon');

const five = require('johnny-five');
const pixel = require('../lib/index.js');

const Board = five.Board;

function newBoard() {
  const sp = new MockSerialPort('/dev/test');
  const io = new MockFirmata(sp);
  io['firmware'] = { name: 'node_pixel_firmata.ino' };

  io.emit('connect');
  io.emit('ready');

  const board = new Board({
    io,
    debug: false,
    repl: false
  });

  return board;
}

function restore(target) {
  for (const prop in target) {
    if (Array.isArray(target[prop])) {
      continue;
    }

    if (target[prop] != null && typeof target[prop].restore === 'function') {
      target[prop].restore();
    }

    if (typeof target[prop] === 'object') {
      restore(target[prop]);
    }
  }
}

exports['Firmata - Initialisation'] = {

  setUp(done) {
    this.board = newBoard();
    done();
  },

  tearDown(done) {
    Board.purge();
    restore(this);
    done();
  },

  firmataInitialisation(test) {
    test.expect(4);
    const mock_firmata = {
      firmware: {
        name: 'node_pixel_firmata.ino'
      }
    };

    test.doesNotThrow(
      () => {
        const strip = new pixel.Strip({
          data: 6,
          length: 8,
          board: this.board
        });
      },
      'If no controller is provided strip should default to firmata without error'
    );

    // check error states.
    test.throws(
      () => {
        const strip = new pixel.Strip({
          data: 6,
          length: 8,
          controller: 'FIRMATA'
        });
      },
      function(err) {
        if (err) {
          if (err.name == 'NoFirmataError') {
            return true;
          }
          return false;
        }
        return false;
      },
      'If board is not present an error should be thrown'
    );

    test.throws(
      () => {
        // build with an empty firmata to test non-writable port.
        //

        const strip = new pixel.Strip({
          data: 6,
          length: 8,
          firmata: mock_firmata,
          controller: 'FIRMATA'
        });
      },
      function(err) {
        if (err) {
          if (err.name == 'NoWritablePortError') {
            return true;
          }
          return false;
        }
        return false;
      },
      'If there is no writable port, controller should throw an error'
    );

    test.throws(
      () => {
        // build with an empty firmata to test bad naming.
        mock_firmata.firmware.name = 'StandardFirmata.ino';

        const strip = new pixel.Strip({
          data: 6,
          length: 8,
          firmata: mock_firmata,
          controller: 'FIRMATA'
        });
      },
      function(err) {
        if (err) {
          if (err.name == 'IncorrectFirmataVersionError') {
            return true;
          }
          return false;
        }
        return false;
      },
      'If firmware name is incorrect, controller should throw an error'
    );

    test.done();
  }


};

exports['Strip - Firmata'] = {
  setUp(done) {
    this.write = sinon.stub(MockSerialPort.prototype, 'write').callsFake( function(buffer, callback) {
      if (typeof callback === 'function') {
        process.nextTick(callback);
      } else {
        return;
      }
    });

    this.board = newBoard();
    done();
  },

  tearDown(done) {
    Board.purge();
    restore(this);
    done();
  },

  stripReady(test) {
    // tests if the strip emits the ready event properly.
    test.expect(2);

    const strip = new pixel.Strip({
      data: 6,
      length: 8,
      board: this.board,
      controller: 'FIRMATA'
    });

    test.equal(this.write.callCount, 1,
      'During initialisation serial write should occur only once');

    strip.on('ready', function() {
      test.ok(true, 'If initialisation is complete a ready event should be emitted');
      test.done();
    });
  },

  maxNumberOfStrips(test) {
    test.expect(1);

    test.throws(
      () => {
        const strip = new pixel.Strip({
          board: this.board,
          controller: 'FIRMATA',
          strips: [8, 8, 8, 8, 8, 8, 8, 8, 8]
        });
      },
      function(err) {
        if (err instanceof RangeError) {
          return true;
        }
      },
      'Excessive number of strips should throw a RangeError'
    );

    test.done();
  },

  maxNumberOfPixels(test) {
    test.expect(2);

    test.throws(
      () => {
        const strip1 = new pixel.Strip({
          board: this.board,
          controller: 'FIRMATA',
          strips: [ {pin: 6, length: 300} ]
        });
      },
      function(err) {
        if (err instanceof RangeError) {
          return true;
        }
      },
      'Excess pixels in a single strip should throw a RangeError'
    );

    test.throws(
      () => {
        const strip2 = new pixel.Strip({
          board: this.board,
          controller: 'FIRMATA',
          strips: [   {pin: 2, length: 64},
            {pin: 2, length: 64},
            {pin: 2, length: 64},
            {pin: 2, length: 64},
            {pin: 2, length: 64}
          ] // more than 256
        });
      },
      function(err) {
        if (err instanceof RangeError) {
          return true;
        }
      },
      'Excess pixels in multiple strips should throw a RangeError'
    );
    test.done();
  },

  show(test) {
    // tests if the strip calls the show out to I2C properly.
    //
    test.expect(2);

    const strip = new pixel.Strip({
      data: 6,
      length: 8,
      board: this.board,
      controller: 'FIRMATA'
    });

    strip.on('ready', function() {
      test.equal(this.write.callCount, 1,
        'Firmata should call serial write only once during setup');
      strip.show();
      test.equal(this.write.callCount, 2,
        'Show should call serial write once after setup is complete.');
      test.done();
    }.bind(this));
  }
};

exports['Pixel - Firmata'] = {
  setUp(done) {
    this.write = sinon.stub(MockSerialPort.prototype, 'write').callsFake(function(buffer, callback) {
      if (typeof callback === 'function') {
        process.nextTick(callback);
      } else {
        return;
      }
    });

    this.board = newBoard();

    this.strip = new pixel.Strip({
      data: 6,
      length: 4,
      board: this.board,
      controller: 'FIRMATA'
    });

    done();
  },

  tearDown(done) {
    Board.purge();
    restore(this);
    done();
  },

  writing(test) {
    // tests to see whether the write to the pixel is going out properly
    test.expect(1);
    this.strip.pixel(0).color('#FFF');
    test.equal(this.write.callCount, 2,
      'Setting the pixel value should make a single serial call');
    test.done()
  }
};

