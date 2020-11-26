import { BackpackPixelOptions, FirmataPixelOptions } from "../types";
import { BackpackPixel } from "./backpack";
import { FirmataPixel } from "./firmata";
import { PixelInit } from "./pixel";
export { Pixel } from './pixel'

export default (opts: PixelInit) : BackpackPixel | FirmataPixel => {
  if (opts.controller === "I2CBACKPACK") {
    return new BackpackPixel(opts as BackpackPixelOptions);
  } else {
    return new FirmataPixel(opts as FirmataPixelOptions);
  }
}
