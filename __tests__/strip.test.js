global.IS_TEST_MODE = true;
const mocks = require('mock-firmata');
const MockFirmata = mocks.Firmata;
const MockSerialPort = mocks.SerialPort;
const five = require('johnny-five');
const pixel = require('../lib/index');
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

describe('Strip', () => {
  let board;
  let strip;
  beforeEach(() => {
    board = newBoard();
    strip = pixel.Strip({
      data: 6,
      length: 8,
      board,
      controller: 'FIRMATA'
    });
  });
  describe('length', () => {
    test('single pixel array', () => {
      const stripOne = pixel.Strip({
        board,
        controller: 'FIRMATA',
        strips: [{pin: 2, length: 100}]
      });
      expect(stripOne.length).toBe(100);
    });
    test('double pixel array', () => {
      const stripTwo = pixel.Strip({
        board,
        controller: 'FIRMATA',
        strips: [{pin: 2, length: 50}, {pin: 3, length: 50}]
      });
      expect(stripTwo.length).toBe(100);
    });
  });
  describe('colour', () => {
    test('hex', () => {
      const colourcheck = {
        r: 255, g: 255, b: 255,
        hexcode: '#FFFFFF',
        color: 'white',
        rgb: [255, 255, 255, 1]
      };
      strip.color('#FFFFFF');
      expect(strip.pixel(0).color()).toEqual(colourcheck);
    });
    test('rgb array', () => {
      const colourcheck = {
        r: 0, g: 255, b: 0,
        hexcode: '#00FF00',
        color: 'lime',
        rgb: [0, 255, 0, 0]
      };
      strip.color([0, 255, 0]);
      expect(strip.pixel(3).color()).toEqual(colourcheck);
    });
    test('ignores trash', () => {
      const colourcheck = {
        r: 0, g: 255, b: 0,
        hexcode: '#00FF00',
        color: 'lime',
        rgb: [0, 255, 0, 0]
      };
      strip.color([0, 255, 0]);
      strip.color('QWERTYUIOP');
      expect(strip.pixel(3).color()).toEqual(colourcheck);
      strip.color();
      expect(strip.pixel(3).color()).toEqual(colourcheck);
    });
    test('can turn off', () => {
      const colourcheck = {
        r: 0, g: 0, b: 0,
        hexcode: '#000000',
        color: 'black',
        rgb: [0, 0, 0, 0]
      };
      strip.off();
      expect(strip.pixel(0).color()).toEqual(colourcheck);
    });
  });
  describe('gamma', () => {
    test('default gamma sets correctly', () => {
      const stripOne = pixel.Strip({
        board,
        controller: 'FIRMATA',
        strips: [{pin: 2, length: 1}]
      });
      expect(stripOne.gamma).toBe(1);
      expect(stripOne.gtable.length).toBe(256);
      expect(stripOne.gtable[18]).toBe(18);
    });
    test('custom gamma sets correctly', () => {
      const stripOne = pixel.Strip({
        board,
        controller: 'FIRMATA',
        strips: [{pin: 2, length: 1}],
        gamma: 2.3
      });
      expect(stripOne.gamma).toBe(2.3);
      expect(stripOne.gtable.length).toBe(256);
      expect(stripOne.gtable[18]).toBe(1);
    });
  });
  describe('shifty pixels', () => {
    const shiftyStrip = pixel.Strip({
      board: newBoard(),
      controller: 'FIRMATA',
      strips: [{ pin: 2, length: 8}]
    });
    test('shift it nowhere', () => {
      // set up a pixel on either end of the strip
      // in preparation for movement.
      shiftyStrip.pixel(1).color('red');
      shiftyStrip.pixel(6).color('blue');

      // call a shift but it shouldn't do anything
      shiftyStrip.shift(0, pixel.FORWARD, false);
      expect(shiftyStrip.pixel(1).color().color).toBe('red');
    });
    test('bring it forward', () => {
      // advance the pixels one step along the strip.
      shiftyStrip.shift(1, pixel.FORWARD, false);
      expect(shiftyStrip.pixel(7).color().color).toBe('blue');
      expect(shiftyStrip.pixel(7).internalPixel.address).toBe(7);
      expect(shiftyStrip.pixel(6).color().color).toBe('black');
      expect(shiftyStrip.pixel(0).color().color).toBe('black');
    });
    test('slam it back, but like only by one', () => {
      shiftyStrip.shift(1, pixel.BACKWARD, false);
      expect(shiftyStrip.pixel(6).color().color).toBe('blue');
      expect(shiftyStrip.pixel(5).color().color).toBe('black');
      expect(shiftyStrip.pixel(7).color().color).toBe('black');
    });
    test('now for the real show, two steps', () => {
      shiftyStrip.shift(2, pixel.FORWARD, true);
      expect(shiftyStrip.pixel(3).color().color).toBe('red');
      expect(shiftyStrip.pixel(0).color().color).toBe('blue');
    });
    test('let\'s see what a full rotation can do', () => {
      shiftyStrip.shift(9, pixel.BACKWARD, true);
      expect(shiftyStrip.pixel(7).color().color).toBe('blue');
      expect(shiftyStrip.pixel(6).color().color).toBe('black');
    });
  });
});
