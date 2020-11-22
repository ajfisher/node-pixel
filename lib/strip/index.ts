import { BackpackOptions, FirmataOptions } from "../types";
import { BackpackStrip } from "./backpack";
import { FirmataStrip } from "./firmata";

export const Strip = (opts: FirmataOptions | BackpackOptions) : BackpackStrip | FirmataStrip => {
  if (opts.controller === "I2CBACKPACK") {
    return new BackpackStrip(opts as BackpackOptions)
  } else {
    return new FirmataStrip(opts as FirmataOptions)
  }
}
