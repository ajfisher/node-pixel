import ColorString, { ColorDescriptor } from 'color-string' // used for color parsing
import { colorValue, normalizeColorWithBrightness } from '../utils';
import { FirmataPixelOptions, BackpackPixelOptions, FirmataBasePixel, BackpackBasePixel, PixelColor } from '../types';
import { normalizeColor } from '../utils';

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
  color(color?: string | [number, number, number], optOverride?: {sendmsg : boolean, brightness?: number}) : void | PixelColor {
    // use a particular form to set the color either
    // color = hex value or named colors or array of colors
    // opts can contain _sendmsg_ as bool. If set to false message won't be
    // sent to firmata - useful for strip level updates to keep message choke down

    const pixel = this.internalPixel;
    if (!pixel) return;
    const shouldMessage = optOverride?.sendmsg !== undefined ? optOverride.sendmsg : this.sendmsg;
    let pixelcolor : ColorDescriptor | null;

    if (color) {
      // get the color based on a string
      if (Array.isArray(color)) {
        // we have an RGB array value
        pixelcolor = {
          model: 'rgb',
          value: [...color, 0]
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
      pixel.color.hexcode = ColorString.to.hex([pixelcolor.value[0], pixelcolor.value[1], pixelcolor.value[2]]);
      pixel.color.color = ColorString.to.keyword([pixelcolor.value[0], pixelcolor.value[1], pixelcolor.value[2]]);
      pixel.color.rgb = pixelcolor.value;

      let finalColor: number
      if (this.internalPixel?.parent.whiteCap) {
        if (optOverride?.brightness !== undefined) {
          finalColor = normalizeColorWithBrightness(pixelcolor.value, optOverride.brightness, this.internalPixel.parent.whiteCap)
        } else {
          finalColor = normalizeColor(pixelcolor.value, this.internalPixel.parent.whiteCap);
        }
      } else {
        finalColor = colorValue(pixelcolor.value, pixel.parent.gtable);
      }
      if (shouldMessage) {
        // TODO probably should be pulling the color off the obj rather than
        // sending it to this function....
        this.fillPixel(finalColor);
      }
    } else {
      console.log("Color supplied couldn't be parsed: " + color);
    }
  }
  colour(color?: string | [number, number, number], optOverride?: {sendmsg : boolean, brightness?: number}) : void | PixelColor {
    this.color(color, optOverride);
  }
  off () : void {
    this.color([0,0,0])
  }
}
