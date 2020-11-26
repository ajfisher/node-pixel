import { ChannelTransformArray } from './types';

type rgbInputArray = [number, number, number, number?]

export const rgbToHex = (colorArray: rgbInputArray) : number => ((colorArray[0] << 16) + (colorArray[1] << 8) + (colorArray[2]));

// helper function for building gamma values
export function buildGammaTable(steps : number, gamma: number) : number[] {
  // used to build a gamma table for a particular value
  return Array(steps).fill(0).map((_, index) => Math.floor(Math.pow((index / 255.0), gamma) * 255 + 0.5));
}

export function colorValue(colors : rgbInputArray, g_table: number[]) : number {
  return rgbToHex([g_table[colors[0]], g_table[colors[1]], g_table[colors[2]]]);
}

export function normalizeColor(colors : rgbInputArray, whiteCap: ChannelTransformArray): number {
  const gammaCorrectedColor = [colors[0], colors[1], colors[2]].map(
    (current, index) => whiteCap[index].g_table[current]
  ).map(
    (current, index) => Math.round((current / 255) * whiteCap[index].maximum)
  );
  return rgbToHex([gammaCorrectedColor[0], gammaCorrectedColor[1], gammaCorrectedColor[2]])
}

export function normalizeColorWithBrightness(colors : rgbInputArray, brightness: number, whiteCap: ChannelTransformArray): number {
  const gammaCorrectedColor = [colors[0], colors[1], colors[2]].map(
    (current, index) => whiteCap[index].g_table[current]
  ).map(
    (current, index) => Math.round((current / 255) * whiteCap[index].maximum)
  )
  .map(
    (current) => Math.round(Math.max(Math.min(current * brightness, 255), 0))
  );
  return rgbToHex([gammaCorrectedColor[0], gammaCorrectedColor[1], gammaCorrectedColor[2]])
}
