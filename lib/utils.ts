import {
  GAMMA_DEFAULT
} from './constants';
import { ChannelTransformArray } from './types';

// helper function for building gamma values
export function create_gamma_table(steps : number, gamma: number, warning: boolean) : number[] {
  // used to build a gamma table for a particular value

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function normalize_color(colors : number[], whiteCap: ChannelTransformArray): number {
  // colors are assumed to be an array of [r, g, b] bytes
  // colorValue returns a packed value able to be pushed to firmata rather than
  // text values.
  // if g_tables are passed then they should use the supplied gamma
  // correction table to correct the received value.

  // before sending, account for gamma correction.
  const gammaCorrectedColor = Object.assign({}, colors);

  gammaCorrectedColor[0] = whiteCap[0].g_table[gammaCorrectedColor[0]];
  gammaCorrectedColor[1] = whiteCap[1].g_table[gammaCorrectedColor[1]];
  gammaCorrectedColor[2] = whiteCap[2].g_table[gammaCorrectedColor[2]];

  gammaCorrectedColor[0] = Math.round((gammaCorrectedColor[0] / 255) * whiteCap[0].maximum)
  gammaCorrectedColor[1] = Math.round((gammaCorrectedColor[1] / 255) * whiteCap[1].maximum)
  gammaCorrectedColor[2] = Math.round((gammaCorrectedColor[2] / 255) * whiteCap[2].maximum)

  return ((gammaCorrectedColor[0] << 16) + (gammaCorrectedColor[1] << 8) + (gammaCorrectedColor[2]));
}
