import {
  FIRMATA_7BIT_MASK,
  PIXEL_SET_PIXEL
} from '../constants'
import { Pixel } from './pixel';
import { BackpackPixelOptions, BackpackBasePixel } from '../types';


export class BackpackPixel extends Pixel {
  internalPixel: BackpackBasePixel
  sendmsg: boolean
  constructor(opts : BackpackPixelOptions) {
    super(opts)
    this.sendmsg = opts.sendmsg !== undefined ? opts.sendmsg : true;
    this.internalPixel = this.createPixel(opts);
  }
  createPixel(opts : BackpackPixelOptions) : BackpackBasePixel {
    const {addr, strip, io, i2c_address} = opts;
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
  createPayload (colorAsNumber : number) : number[] {
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
  fillPixel(inputColor : number) : void {
    const message = this.createPayload(inputColor);
    this.internalPixel.io.i2cWrite(this.internalPixel.i2c_address, message);
  }
}
