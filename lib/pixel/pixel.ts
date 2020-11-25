import ColorString, { ColorDescriptor } from 'color-string' // used for color parsing
import { FirmataPixelOptions, BackpackPixelOptions, FirmataBasePixel, BackpackBasePixel, PixelColor } from '../types';

export function colorValue(colors : number[], g_table: number[]) : number {
  // colors are assumed to be an array of [r, g, b] bytes
  // colorValue returns a packed value able to be pushed to firmata rather than
  // text values.
  // if gtable is passed then it should use the supplied gamma
  // correction table to correct the received value.

  // before sending, account for gamma correction.
  const gammaCorrectedColor = Object.assign({}, colors);

  gammaCorrectedColor[0] = g_table[gammaCorrectedColor[0]];
  gammaCorrectedColor[1] = g_table[gammaCorrectedColor[1]];
  gammaCorrectedColor[2] = g_table[gammaCorrectedColor[2]];

  return ((gammaCorrectedColor[0] << 16) + (gammaCorrectedColor[1] << 8) + (gammaCorrectedColor[2]));
}

export type PixelInit = FirmataPixelOptions | BackpackPixelOptions
export type BasePixelConfiguration = FirmataBasePixel | BackpackBasePixel | undefined

export class Pixel {
  internalPixel: BasePixelConfiguration
  sendmsg: boolean
  constructor(opts : PixelInit) {
    this.sendmsg = opts.sendmsg !== undefined ? opts.sendmsg : true;
    this.internalPixel = this.createPixel(opts);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createPixel(opts: PixelInit) : BasePixelConfiguration {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fillPixel(inputColor : number) : void {
    return;
  }
  color(color?: string | [number, number, number], optOverride?: {sendmsg : boolean}) : void | PixelColor {
    // use a particular form to set the color either
    // color = hex value or named colors or array of colors
    // opts can contain _sendmsg_ as bool. If set to false message won't be
    // sent to firmata - useful for strip level updates to keep message choke down

    const pixel = this.internalPixel;
    if (!pixel) return;
    const shouldMessage = optOverride?.sendmsg !== undefined ? optOverride.sendmsg : this.sendmsg;
    let pixelcolor : ColorDescriptor | {model: string, value: [number, number, number]} | null;

    if (color) {
      // get the color based on a string
      if (Array.isArray(color)) {
        // we have an RGB array value
        pixelcolor = {
          model: 'rgb',
          value: color
        };
      } else {
        pixelcolor = ColorString.get(color);
        if (pixelcolor === null) {
          return pixel.color;
        }
      }
    } else {
      return pixel.color;
    }

    if (pixelcolor != null) {
      // fill out the values for the pixel and then send the message to update
      // it on the strip
      pixel.color.r = pixelcolor.value[0];
      pixel.color.g = pixelcolor.value[1];
      pixel.color.b = pixelcolor.value[2];
      pixel.color.hexcode = ColorString.to.hex(pixelcolor.value);
      pixel.color.color = ColorString.to.keyword(pixelcolor.value);
      if (pixelcolor.value.length == 4) {
        pixelcolor.value.pop();
      }
      pixel.color.rgb = pixelcolor.value as [number, number, number];

      let pixelColor = colorValue(pixelcolor.value, pixel.parent.gtable);
      if (this.internalPixel?.parent.whiteCap) {
        // pixelColor = some transform
      }
      if (shouldMessage) {
        // TODO probably should be pulling the color off the obj rather than
        // sending it to this function....
        this.fillPixel(pixelColor);
      }
    } else {
      console.log("Color supplied couldn't be parsed: " + color);
    }
  }
  colour(color?: string | [number, number, number], optOverride?: {sendmsg : boolean}) : void | PixelColor {
    this.color(color, optOverride);
  }
  off () : void {
    this.color([0,0,0])
  }
}
