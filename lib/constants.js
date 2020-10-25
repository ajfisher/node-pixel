const START_SYSEX = 0xF0;
const STRING_DATA =       0x71;
const END_SYSEX =         0xF7;
const FIRMATA_7BIT_MASK = 0x7F;
const PIXEL_SHIFT_WRAP =  0x40;
const PIXEL_COMMAND =     0x51;
const PIXEL_OFF =         0x00;
const PIXEL_CONFIG =      0x01;
const PIXEL_SHOW =        0x02;
const PIXEL_SET_PIXEL =   0x03;
const PIXEL_SET_STRIP =   0x04;
const PIXEL_SHIFT =       0x05;
const SHIFT_FORWARD =     0x20;
const SHIFT_BACKWARD =    0x00;

const MAX_STRIPS = 8;

const PIN_DEFAULT = 6; // use this if not supplied

const I2C_DEFAULT =   0x42;

const GAMMA_DEFAULT = 1.0; // set to 1.0 in 0.9, 2.8 in 0.10

const COLOR_ORDER = {
  GRB: 0x00,
  RGB: 0x01,
  BRG: 0x02
};

module.exports = {
  START_SYSEX,
  STRING_DATA,
  END_SYSEX,
  FIRMATA_7BIT_MASK,
  PIXEL_SHIFT_WRAP,
  PIXEL_COMMAND,
  PIXEL_OFF,
  PIXEL_CONFIG,
  PIXEL_SHOW,
  PIXEL_SET_PIXEL,
  PIXEL_SET_STRIP,
  PIXEL_SHIFT,
  SHIFT_FORWARD,
  SHIFT_BACKWARD,
  MAX_STRIPS,
  PIN_DEFAULT,
  I2C_DEFAULT,
  GAMMA_DEFAULT,
  COLOR_ORDER
};
