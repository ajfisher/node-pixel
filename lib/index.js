'use strict';

const {Strip} = require('./strip');
const {
  COLOR_ORDER,
  SHIFT_FORWARD,
  SHIFT_BACKWARD
} = require('./constants');

module.exports = {
  Strip,
  COLOR_ORDER,
  FORWARD: SHIFT_FORWARD,
  BACKWARD: SHIFT_BACKWARD
};
