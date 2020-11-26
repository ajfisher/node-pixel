global.IS_TEST_MODE = true;
const mocks = require('mock-firmata');
const MockFirmata = mocks.Firmata;
const MockSerialPort = mocks.SerialPort;

const sinon = require('sinon');

const five = require('johnny-five');
const pixel = require('../dist/index.js');
const { colorValue } = require('../dist/utils');
const { buildGammaTable } = require('../dist/utils');

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

exports['Test Mode configured'] = {
  setUp(done) {
    done();
  },

  tearDown(done) {
    done();
  },

  testMode(test) {
    // tests that the env variable is set properly
    test.expect(1);
    test.equal(process.env.IS_TEST_MODE, 'true', 'Test mode should be configured');
    test.done();
  }
};

exports['Color Value'] = {
  setUp(done) {
    done();
  },
  tearDown(done) {
    done();
  },
  leak(test) {
    test.expect(1);
    const internalGTable = buildGammaTable(256, 2.8, false);
    const baseColor = [123,123,123];
    colorValue(baseColor, internalGTable);
    test.deepEqual(baseColor, [123,123,123], 'The input should not be modified at all by the gamma correction');
    test.done();
  }
};

exports['Pixel'] = {
  setUp(done) {
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

  colour(test) {
    // tests if the colour sequences are working okay
    test.expect(3);

    let colourcheck = {
      r: 255, g: 255, b: 255,
      hexcode: '#FFFFFF',
      color: 'white',
      rgb: [255, 255, 255, 1]
    };

    this.strip.pixel(0).color('#FFFFFF');
    test.deepEqual(this.strip.pixel(0).color(), colourcheck,
      'If pixel colour is set, the pixel colour object should be updated');

    colourcheck = {
      r: 0, g: 255, b: 0,
      hexcode: '#00FF00',
      color: 'lime',
      rgb: [0, 255, 0, 0]
    };

    this.strip.pixel(3).color([0, 255, 0]);
    test.deepEqual(this.strip.pixel(3).color(), colourcheck,
      'If setting the pixel colour using RGB array, the pixel colour object should be updated');

    test.doesNotThrow(
      () => {
        this.strip.pixel(1).colour('QWERTYUIOP');
      },
      undefined,
      'An invalid color should be ignored not throw an error'
    );

    test.done();
  },

  off(test) {
    // tests if setting strip off results in black pixel colour
    test.expect(1);

    this.strip.color('#FF0000');

    const colourcheck = {
      r: 0, g: 0, b: 0,
      hexcode: '#000000',
      color: 'black',
      rgb: [0, 0, 0, 0]
    };

    this.strip.pixel(1).off();
    test.deepEqual(this.strip.pixel(1).color(), colourcheck,
      'If setting a colour then turning a pixel off, the colour should revert to off state.');
    test.done();
  }
};
