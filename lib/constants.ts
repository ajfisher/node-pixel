export const START_SYSEX = 0xF0;
export const STRING_DATA =       0x71;
export const END_SYSEX =         0xF7;
export const FIRMATA_7BIT_MASK = 0x7F;
export const PIXEL_SHIFT_WRAP =  0x40;
export const PIXEL_COMMAND =     0x51;
export const PIXEL_OFF =         0x00;
export const PIXEL_CONFIG =      0x01;
export const PIXEL_SHOW =        0x02;
export const PIXEL_SET_PIXEL =   0x03;
export const PIXEL_SET_STRIP =   0x04;
export const PIXEL_SHIFT =       0x05;
export const SHIFT_FORWARD =     0x20;
export const SHIFT_BACKWARD =    0x00;

export const MAX_STRIPS = 8;

export const PIN_DEFAULT = 6; // use this if not supplied

export const I2C_DEFAULT =   0x42;

export const GAMMA_DEFAULT = 1.0; // set to 1.0 in 0.9, 2.8 in 0.10

export const COLOR_ORDER = {
  GRB: 0x00,
  RGB: 0x01,
  BRG: 0x02
};
