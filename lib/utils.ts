import {
  GAMMA_DEFAULT
} from './constants';

// helper function for building gamma values
export function create_gamma_table(steps : number, gamma: number, warning: boolean) : number[] {
  // used to build a gamma table for a particular value

  if (! warning && gamma == GAMMA_DEFAULT && ! (global as any).IS_TEST_MODE) {
    console.info('INFO: Default gamma behaviour is changing');
    console.info('0.9 - gamma=1.0 - consistent with pre-gamma values');
    console.info('0.10 - gamma=2.8 - default fix for WS2812 LEDs');
    warning = true;
  }

  const g_table : number[] = new Array(steps);
  for (let i = 0; i < steps; i++) {
    g_table[i] = Math.floor(Math.pow((i / 255.0), gamma) * 255 + 0.5);
  }

  return g_table;
}

