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

exports['Strip - I2C'] = {
  setUp(done) {
    this.board = newBoard();
    this.clock = sinon.useFakeTimers();
    this.i2cConfig = sinon.spy(MockFirmata.prototype, 'i2cConfig');
    this.i2cWrite = sinon.stub(MockFirmata.prototype, 'i2cWrite').callsFake(function(i2caddr, data) {
      return;
    });

    done();
  },

  tearDown(done) {
    this.i2cConfig.restore();
    this.i2cWrite.restore();
    this.clock.restore();
    done();
  },

  i2cControllerConfig(test) {
    // ensures that the configuration of the controller works correctly

    test.expect(1);

    test.throws(
      () => {
        const strip = new pixel.Strip({
          data: 6,
          length: 8,
          board: {},
          controller: 'I2CBACKPACK'
        });
      },
      function(err) {
        if (err) {
          if (err.name == 'NoIOError') {
            return true;
          }
          return false;
        }
        return false;
      },
      'If IO is not present an error should be thrown'
    );

    test.done();
  },

  stripReady(test) {
    // tests if the strip emits the ready event properly.

    test.expect(3);
    const strip = new pixel.Strip({
      data: 6,
      length: 8,
      board: this.board,
      controller: 'I2CBACKPACK'
    });

    // emit the ready event ahead of time.

    test.equal(this.i2cConfig.callCount, 1,
      'I2C Config should be called only once during config.');

    strip.on('ready', function() {
      test.equal(this.i2cWrite.callCount, 1,
        'I2C Write should be called once as part of config');
      test.ok(true,
        'If configuration is complete a ready even should be emitted');
      test.done();
    }.bind(this));
  },

  maxNumberOfStrips(test) {
    test.expect(1);

    test.throws(
      () => {
        const strip = new pixel.Strip({
          board: this.board,
          controller: 'I2CBACKPACK',
          strips: [8, 8, 8, 8, 8, 8, 8, 8, 8]
        });
      },
      function(err)  {
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
          controller: 'I2CBACKPACK',
          strips: [ 600 ]
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
          controller: 'I2CBACKPACK',
          strips: [ 100, 100, 100, 100, 100, 100, 100 ]
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
    test.expect(1);

    const strip = new pixel.Strip({
      data: 6,
      length: 8,
      board: this.board,
      controller: 'I2CBACKPACK'
    });

    strip.on('ready', function() {
      strip.show();
      // first call count will be for the setup call
      test.equal(this.i2cWrite.callCount, 2,
        'i2cWrite should be called only once during show');
      test.done();
    }.bind(this));
  },

  color(test) {
    // aims for coverage tests to ensure that colours are set properly.
    //
    test.expect(2);

    const strip = new pixel.Strip({
      data: 6,
      length: 8,
      board: this.board,
      controller: 'I2CBACKPACK'
    });

    strip.on('ready', function() {
      strip.color('red');
      // first call count will be for the setup call
      test.equal(this.i2cWrite.callCount, 2,
        'i2cWrite should be called only once during colour setting');

      strip.shift(1, pixel.FORWARDS, true);
      test.equal(this.i2cWrite.callCount, 3,
        'i2cWrite should be called only once during shift call');

      test.done();
    }.bind(this));
  }
};

exports['Pixel - I2C'] = {
  setUp(done) {
    this.board = newBoard();
    this.clock = sinon.useFakeTimers();
    this.i2cConfig = sinon.spy(MockFirmata.prototype, 'i2cConfig');
    this.i2cWrite = sinon.stub(MockFirmata.prototype, 'i2cWrite').callsFake(function(i2caddr, data) {
      return;
    });

    this.strip = new pixel.Strip({
      data: 6,
      length: 4,
      board: this.board,
      controller: 'I2CBACKPACK'
    });

    done();
  },

  tearDown(done) {
    this.i2cConfig.restore();
    this.i2cWrite.restore();
    this.clock.restore();
    done();
  },

  writing(test) {
    // tests to see whether the write to the pixel is going out properly
    test.expect(1);
    this.strip.pixel(0).color('#FFF');
    test.equal(this.i2cWrite.callCount, 1,
      'i2cWrite should only call once to write a pixel value');
    test.done()
  }
}
