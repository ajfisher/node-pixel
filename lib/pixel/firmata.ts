import {
  START_SYSEX,
  END_SYSEX,
  FIRMATA_7BIT_MASK,
  PIXEL_COMMAND,
  PIXEL_SET_PIXEL
} from '../constants'
import { Pixel } from './pixel';
import { FirmataPixelOptions, FirmataBasePixel } from '../types';

export class FirmataPixel extends Pixel {
  internalPixel: FirmataBasePixel
  sendmsg: boolean
  constructor(opts : FirmataPixelOptions) {
    super(opts)
    this.sendmsg = opts.sendmsg !== undefined ? opts.sendmsg : true;
    this.internalPixel = this.createPixel(opts);
  }
  createPixel(opts : FirmataPixelOptions) : FirmataBasePixel {
    const {addr, strip, port, firmata} = opts;
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
  createPayload (colorAsNumber : number) : number[] {
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
    const message = this.createPayload(inputColor);
    this.internalPixel.port.write(Buffer.from(message));
  }
}
