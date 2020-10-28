'use strict';

// Defines a set of WS2812 LED Pixels for use

// TODO:
// Pixels can be arranged into different structures // NICE TO HAVE
// Do we have a grid which can be 1D, 2D or 3D and any size
// Pixels needs to have a length, various deets on where it is (clock etc)
// Keyframing // NICE TO HAVE
// Pixel grid should be able to:
//      - Set pixels in a range from X->Y a colour

const {Strip} = require('./strip');
const {
  COLOR_ORDER,
  SHIFT_FORWARD,
  SHIFT_BACKWARD
} = require('./constants')

module.exports = {
  Strip,
  COLOR_ORDER,
  FORWARD: SHIFT_FORWARD,
  BACKWARD: SHIFT_BACKWARD
};
