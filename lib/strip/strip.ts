import {EventEmitter} from 'events'
import ColorString, { Color } from 'color-string'
import { Pixel } from '../pixel/'
import { GAMMA_DEFAULT, SHIFT_BACKWARD, SHIFT_FORWARD } from '../constants'
import { buildGammaTable, normalizeColor, colorValue, normalizeColorWithBrightness } from '../utils'
import { BaseStripOptions, ChannelTransformArray } from '../types'

export class Strip extends EventEmitter {
  pixels: Pixel[]
  gtable: number[]
  gamma: number
  length: number
  whiteCap?: ChannelTransformArray
  constructor(opts : BaseStripOptions) {
    super()
    this.gamma = opts.gamma || GAMMA_DEFAULT
    this.gtable = buildGammaTable(256, this.gamma);
    this.whiteCap = this.createWhiteCap(opts.whiteCap);
    this.pixels = [];
    this.length = 0;
  }
  createWhiteCap(userWhiteCaps?: BaseStripOptions['whiteCap']): ChannelTransformArray | undefined {
    if (userWhiteCaps?.length === 3) {
      return userWhiteCaps.map(
        value => value.gamma ? value : {
          ...value,
          gamma: this.gamma,
          g_table: buildGammaTable(256, this.gamma)
        }
      ) as ChannelTransformArray;
    }
  }
  pixel(addr : number) : Pixel | undefined {
    return this.pixels && this.pixels[addr]
  }
  getLength () : number {
    return this.pixels? this.pixels.length : 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stripColor (color: number) : void {
    return;
  }
  show() : void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _shift(amt : number, direction: typeof SHIFT_FORWARD | typeof SHIFT_BACKWARD, wrap: boolean) : void {
    return;
  }
  shift(amt : number, direction: typeof SHIFT_FORWARD | typeof SHIFT_BACKWARD, wrap: boolean) : void {
    // public version of the shift function independent of the controller.
    // this looks after the actual internal shifting of the pixels within the
    // js side and then calls the controller to mirror the same function.
    if (!this.pixels) return;
    if (amt > 0) {

      // take a copy of the pixels at the end that is being towards
      let start_element = 0;
      if (direction == SHIFT_FORWARD) {
        start_element = this.length - amt;
      }
      const tmp_pixels = this.pixels.splice(start_element, amt);

      while (tmp_pixels.length > 0) {
        const px = tmp_pixels.pop();
        if (!px) {
          break;
        }
        // set the pixel off if not wrapping.
        if (! wrap) {
          px.color('#000');
        }

        if (direction == SHIFT_FORWARD) {
          this.pixels.unshift(px);
        } else {
          this.pixels.push(px);
        }
      }

      // renumber the items so the addresses are correct for display
      this.pixels.forEach((px, index) => {
        px.internalPixel && px.internalPixel.address ? px.internalPixel.address = index : undefined;
      });

      // now get the firmware to update appropriately as well.
      this._shift(amt, direction, wrap);
    }
  }
  color (color?: string | [number, number, number], brightness?: number) : void {
    // sets the color of the entire strip
    // use a particular form to set the color either
    // color = hex value or named colors
    // or set color null and set opt which is an object as {rgb: [rx, gx, bx]}
    // values where x is an 8-bit value (0-255);
    if (!this.pixels) {
      return;
    }
    let stripcolor : Color | [number, number, number] | undefined;

    if (color) {
      // use text to determine the color
      if (Array.isArray(color)) {
        // we have an RGB array value
        stripcolor = color;
      } else {
        stripcolor = ColorString.get(color)?.value;
      }
    }

    if (stripcolor) {
      // fill out the values for the pixels and then update the strip
      for (let i = 0; i < this.pixels.length; i++) {
        this.pixels[i].color(color, {sendmsg: false});
      }

      // set the whole strip color to the appropriate int value
      let builtColor = colorValue(stripcolor, this.gtable)
      if (this.whiteCap) {
        if (brightness !== undefined) {
          builtColor = normalizeColorWithBrightness(stripcolor, brightness, this.whiteCap);
        } else {
          builtColor = normalizeColor(stripcolor, this.whiteCap);
        }
      }
      this.stripColor(builtColor);
    } else {
      console.log("Supplied colour couldn't be parsed: " + color);
    }
  }
  colour (color?: string | [number, number, number], brightness?: number) : void {
    return this.color(color, brightness)
  }
  off() : this {
    this.color([0,0,0])
    this.show();
    return this;
  }
}
