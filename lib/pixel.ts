'use strict';

// Defines a set of WS2812 LED Pixels for use

// TODO:
// Pixels can be arranged into different structures // NICE TO HAVE
// Do we have a grid which can be 1D, 2D or 3D and any size
// Pixels needs to have a length, various deets on where it is (clock etc)
// Keyframing // NICE TO HAVE
// Pixel grid should be able to:
//      - Set pixels in a range from X->Y a colour

import ColorString, { ColorDescriptor } from 'color-string' // used for color parsing
import {
  START_SYSEX,
  END_SYSEX,
  FIRMATA_7BIT_MASK,
  PIXEL_COMMAND,
  PIXEL_SET_PIXEL
} from './constants'
import { FirmataPixelOptions, BackpackPixelOptions, FirmataBasePixel, BackpackBasePixel, PixelOptions, PixelColor } from './types';

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

type PixelInit = FirmataPixelOptions | BackpackPixelOptions
type BasePixelConfiguration = FirmataBasePixel | BackpackBasePixel

export class Pixel {
  mode: PixelOptions["controller"]
  internalPixel: BasePixelConfiguration
  sendmsg: boolean
  constructor(opts : PixelInit) {
    this.mode = opts.controller;
    this.sendmsg = opts.sendmsg !== undefined ? opts.sendmsg : true;
    this.internalPixel = this.createPixel(opts);
  }
  createPixel(opts : PixelInit) : BasePixelConfiguration {
    const {addr, strip} = opts;
    switch(opts.controller) {
      case "I2CBACKPACK": {
        const {io, i2c_address} = opts as BackpackPixelOptions
        return {
          address: addr,
          id: addr,
          color: {
            r: 0, g: 0, b: 0, hexcode: '#000000', color: 'black', rgb: [0,0,0]
          },
          io: io,
          i2c_address: i2c_address,
          parent: strip
        };
      }
      case "FIRMATA":
      default: {
        const { port, firmata } = opts as FirmataPixelOptions
        return {
          address: addr,
          id: addr,
          color: {
            r: 0, g: 0, b: 0, hexcode: '#000000', color: 'black', rgb: [0,0,0]
          },
          firmata: firmata,
          port: port,
          parent: strip
        };
      }
    }
  }
  createBackpackPayload (colorAsNumber : number) : number[] {
    const data : number[] = [];
    data.push(PIXEL_SET_PIXEL);
    data.push(this.internalPixel.address & FIRMATA_7BIT_MASK);
    data.push((this.internalPixel.address >> 7) & FIRMATA_7BIT_MASK);
    data.push(colorAsNumber & FIRMATA_7BIT_MASK);
    data.push((colorAsNumber >> 7) & FIRMATA_7BIT_MASK);
    data.push((colorAsNumber >> 14) & FIRMATA_7BIT_MASK);
    data.push((colorAsNumber >> 21) & FIRMATA_7BIT_MASK);
    return data;
  }
  createFirmataPayload (colorAsNumber : number) : number[] {
    const data : number[] = [];
    data.push(START_SYSEX);
    data.push(PIXEL_COMMAND);
    data.push(PIXEL_SET_PIXEL);
    data.push(this.internalPixel.address & FIRMATA_7BIT_MASK);
    data.push((this.internalPixel.address >> 7) & FIRMATA_7BIT_MASK);
    data.push(colorAsNumber & FIRMATA_7BIT_MASK);
    data.push((colorAsNumber >> 7) & FIRMATA_7BIT_MASK);
    data.push((colorAsNumber >> 14) & FIRMATA_7BIT_MASK);
    data.push((colorAsNumber >> 21) & FIRMATA_7BIT_MASK);
    data.push(END_SYSEX);
    return data;
  }
  fillPixel(inputColor : number) : void {
    let message;
    switch(this.mode) {
      case "I2CBACKPACK":
        message = this.createBackpackPayload(inputColor);
        (this.internalPixel as BackpackBasePixel).io.i2cWrite((this.internalPixel as BackpackBasePixel).i2c_address, message);
        return;
      case "FIRMATA":
      default:
        message = this.createFirmataPayload(inputColor);
        (this.internalPixel as FirmataBasePixel).port.write(Buffer.from(message));
        return;
    }
  }
  color(color : string | [number, number, number] | undefined, optOverride?: {sendmsg : boolean}) : void | PixelColor {
    // use a particular form to set the color either
    // color = hex value or named colors or array of colors
    // opts can contain _sendmsg_ as bool. If set to false message won't be
    // sent to firmata - useful for strip level updates to keep message choke down

    const pixel = this.internalPixel;
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

      const pixelColor = colorValue(pixelcolor.value, pixel.parent.gtable);
      if (shouldMessage) {
        // TODO probably should be pulling the color off the obj rather than
        // sending it to this function....
        this.fillPixel(pixelColor);
      }
    } else {
      console.log("Color supplied couldn't be parsed: " + color);
    }
  }
  colour(color : string | [number, number, number] | undefined, optOverride?: {sendmsg : boolean}) : void | PixelColor {
    this.color(color, optOverride);
  }
  off () : void {
    this.color([0,0,0])
  }
}
