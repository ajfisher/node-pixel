const {
  GAMMA_DEFAULT
} = require('./constants');

// helper function for building gamma values
function create_gamma_table(steps, gamma, warning) {
  // used to build a gamma table for a particular value

  if (! warning && gamma == GAMMA_DEFAULT && ! global.IS_TEST_MODE) {
    console.info('INFO: Default gamma behaviour is changing');
    console.info('0.9 - gamma=1.0 - consistent with pre-gamma values');
    console.info('0.10 - gamma=2.8 - default fix for WS2812 LEDs');
    warning = true;
  }

  const g_table = new Array(steps);
  for (let i = 0; i < steps; i++) {
    g_table[i] = Math.floor(Math.pow((i / 255.0), gamma) * 255 + 0.5);
  }

  return g_table;
}

module.exports = {
  create_gamma_table
}
