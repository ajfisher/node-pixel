import { COLOR_ORDER } from "..";
import { I2C_DEFAULT, MAX_STRIPS, PIXEL_CONFIG, FIRMATA_7BIT_MASK, PIXEL_SHOW, PIXEL_SET_STRIP, PIXEL_SHIFT, PIXEL_SHIFT_WRAP, SHIFT_BACKWARD, SHIFT_FORWARD } from "../constants";
import buildPixel from "../pixel";
import { BackpackOptions, StripConfig } from "../types";
import { Strip } from "./strip";
import {Firmware} from 'firmata'
import {Board} from 'johnny-five'

export class BackpackStrip extends Strip {
  io: Firmware | Board['io']
  i2c_address: number
  constructor(opts : BackpackOptions) {
    super(opts)
    const MAX_PIXELS = 500; // based on # bytes available in firmata
    const strip_length = opts.length || 6; // just an arbitrary val
    const strip_definition = opts.strips || [];
    const color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB
    const io = opts.firmata || opts.board?.io;

    if (!opts.address) {
      opts.address = I2C_DEFAULT;
    }
    if (io === undefined) {
      const err = new Error('An IO object is required to I2C controller');
      err.name = 'NoIOError';
      throw err;
    }
    const builtStripInstances : StripConfig[] = [];
    // work out the map of strips and pixels.
    if (typeof(strip_definition[0]) === 'undefined') {
      // there is nothing specified so it's probably a single strip
      // using the length and colour type.
      builtStripInstances.push({
        color_order,
        length: strip_length
      });
    } else if (!isNaN(+strip_definition[0])) {
      // we have the array of pin lengths but do we have the colour
      for (let i = 0; i< strip_definition.length; i++) {
        const len = strip_definition[i];
        builtStripInstances[i] = {
          color_order,
          length: +len
        };
      }
    } else {
      (strip_definition as StripConfig[]).forEach((stripValue : StripConfig) => builtStripInstances.push(stripValue))
    }

    // put in check if it's gone over.
    if (builtStripInstances.length > MAX_STRIPS) {
      const err = new RangeError('Maximum number of strips ' + MAX_STRIPS + ' exceeded');
      this.emit('error', err);
    }
    let total_length = 0;
    builtStripInstances.forEach(function(data) {
      total_length += data.length;
    });

    // put in check if there are too many pixels.
    if (total_length > MAX_PIXELS) {
      const err = new RangeError('Maximum number of pixels ' + MAX_PIXELS + ' exceeded');
      this.emit('error', err);
    }

    this.length = total_length

    for (let i=0; i < total_length; i++) {
      this.pixels.push(buildPixel({
        addr: i,
        io,
        controller: 'I2CBACKPACK',
        i2c_address: opts.address,
        strip: this
      }));
    }

    this.io = io;
    this.i2c_address = opts.address

    // now send the config message with length and data point.
    const data : number[] = [];

    data.push(PIXEL_CONFIG);
    builtStripInstances.forEach(function(strip) {
      const colorOrder = strip.color_order;
      const pinLocation = strip.pin || 0;
      const pinOrColorInfo = colorOrder ? (colorOrder << 5) : pinLocation
      data.push( pinOrColorInfo );
      data.push( strip.length & FIRMATA_7BIT_MASK);
      data.push( (strip.length >> 7) & FIRMATA_7BIT_MASK);
    });
    // send the I2C config message.
    this.io.i2cConfig(opts);
    process.nextTick(() => {
      try {
        io.i2cWrite(opts.address, data);
      } catch (e) {
        if (e instanceof Error && e.name == 'EIO') {
          this.emit('np_i2c_write_error', data);
        }
      }
      process.nextTick(() => {
        this.emit('ready', null)
      });
    });
  }
  show() : void {
    try {
      this.io.i2cWrite(this.i2c_address, [PIXEL_SHOW]);
    } catch (e) {
      if (e instanceof Error && e.name == 'EIO') {
        this.emit('np_i2c_write_error', 'PIXEL_SHOW');
      }
    }
  }
  stripColor(color: number) : void {
    const data : number[] = [];
    data[0] = PIXEL_SET_STRIP;
    data[1] = color & FIRMATA_7BIT_MASK;
    data[2] = (color >> 7) & FIRMATA_7BIT_MASK;
    data[3] = (color >> 14) & FIRMATA_7BIT_MASK;
    data[4] = (color >> 21) & FIRMATA_7BIT_MASK;
    try {
      this.io.i2cWrite(this.i2c_address, data);
    } catch (e) {
      if (e instanceof Error && e.name == 'EIO') {
        this.emit('np_i2c_write_error', data);
      }
    }
  }
  _shift(amt: number, direction: typeof SHIFT_FORWARD | typeof SHIFT_BACKWARD, wrap: boolean) : void {
    // shifts the strip in the appropriate direction.
    const wrap_val = wrap ? PIXEL_SHIFT_WRAP : 0;
    const data : number[] = [];
    data[0] = PIXEL_SHIFT;
    data[1] = (amt | direction | wrap_val) & FIRMATA_7BIT_MASK;
    try {
      this.io.i2cWrite(this.i2c_address, data);
    } catch (e) {
      if (e instanceof Error && e.name == 'EIO') {
        this.emit('np_i2c_write_error', data);
      }
    }
  }
}
