import Board from "firmata";
import { COLOR_ORDER } from "..";
import { PIN_DEFAULT, MAX_STRIPS, START_SYSEX, PIXEL_COMMAND, PIXEL_CONFIG, FIRMATA_7BIT_MASK, END_SYSEX, PIXEL_SHOW, PIXEL_SET_STRIP, PIXEL_SHIFT, PIXEL_SHIFT_WRAP, SHIFT_BACKWARD, SHIFT_FORWARD } from "../constants";
import buildPixel from "../pixel";
import { FirmataOptions, StripConfig } from "../types";
import { Strip } from "./strip";
import {Board as JohnnyBoard} from 'johnny-five';

export class FirmataStrip extends Strip {
  io: Board | JohnnyBoard['io']
  port: {write: (message: Buffer, cb?: (err: Error, msg?: unknown) => void) => void}
  length: number
  constructor(opts : FirmataOptions) {
    super(opts);
    const MAX_PIXELS = 216; // based on # bytes available in firmata
    const strip_length = opts.length || 6; // just an arbitrary val
    const data_pin = opts.data || PIN_DEFAULT;
    const color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB
    const strip_definition = opts.strips || [];
    const skip_firmware_check = !!opts.skip_firmware_check;
    // do firmata / IO checks
    const firmata = opts.firmata || opts?.board?.io;
    // check if we're *still* undefined
    if (firmata === undefined) {
      const err = new Error('A firmata or board object is required');
      err.name = 'NoFirmataError';
      throw err;
    }

    if (firmata.firmware.name !== 'node_pixel_firmata.ino' && !skip_firmware_check) {
      const err = new Error('Please upload NodePixel Firmata to the board');
      err.name = 'IncorrectFirmataVersionError';
      throw err;
    }

    // figure out where we are writing to
    const port = firmata.transport || firmata.sp || firmata;

    if (port.write === undefined) {
      const err = new Error('Node Pixel FIRMATA controller requires IO that can write out');
      err.name = 'NoWritablePortError';
      throw err;
    }
    this.port = port;
    const builtStripInstances : StripConfig[] = [];
    // work out the map of strips and pixels.
    if (typeof(strip_definition[0]) === 'undefined') {
      // there is nothing specified so it's probably a single strip
      // using the length and colour type.
      builtStripInstances.push({
        color_order,
        pin: data_pin,
        length: strip_length
      });
    } else if (!isNaN(+strip_definition[0])) {
      // we have the array of pin lengths but do we have the colour
      for (let i = 0; i< strip_definition.length; i++) {
        const len = strip_definition[i];
        builtStripInstances[i] = {
          pin: data_pin,
          color_order,
          length: +len
        };
      }
    } else {
      (strip_definition as StripConfig[]).forEach((stripValue : StripConfig) => builtStripInstances.push(stripValue))
    }

    // put in check if it's gone over value
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

    for (let i=0; i< total_length; i++) {
      this.pixels.push(buildPixel({
        addr: i,
        firmata,
        port,
        controller: 'FIRMATA',
        strip: this
      }));
    }

    // now send the config message with length and data point.
    const data : number[] = [];

    data[0] = START_SYSEX;
    data[1] = PIXEL_COMMAND;
    data[2] = PIXEL_CONFIG;
    builtStripInstances.forEach(function(strip) {
      const colorOrder = strip.color_order;
      const pinLocation = strip.pin || 0;
      const pinOrColorInfo = colorOrder ? (colorOrder << 5) : pinLocation
      data.push( pinOrColorInfo );
      data.push( strip.length & FIRMATA_7BIT_MASK);
      data.push( (strip.length >> 7) & FIRMATA_7BIT_MASK);
    });
    data.push(END_SYSEX);

    this.port.write(Buffer.from(data), (error: Error) => {
      let err : Error;
      if (error) {
        err = error;
        this.emit('error', err);
      }
      // there is a weird bug in OSX which sometimes causes
      // a segfault if you try to write to fast. As such
      // just delay the ready event by 1msec because even this
      // is faster than hooman will perceive as a delay
      setTimeout(() => {
        this.emit('ready', err);
      }, 1);
    });
  }
  show() : void {
    const data : number[] = [];
    data[0] = START_SYSEX;
    data[1] = PIXEL_COMMAND;
    data[2] = PIXEL_SHOW;
    data[3] = END_SYSEX;

    // now just write that to the port and it should show the frame.
    this.port.write(Buffer.from(data));
  }
  stripColor(color: number) : void {
    // colour work is already done this just sets it the appropriate
    // way.
    const data : number[] = [];

    data[0] = START_SYSEX;
    data[1] = PIXEL_COMMAND;
    data[2] = PIXEL_SET_STRIP;
    data[3] = color & FIRMATA_7BIT_MASK;
    data[4] = (color >> 7) & FIRMATA_7BIT_MASK;
    data[5] = (color >> 14) & FIRMATA_7BIT_MASK;
    data[6] = (color >> 21) & FIRMATA_7BIT_MASK;
    data[7] = END_SYSEX;

    this.port.write(Buffer.from(data));
  }
  _shift(amt : number, direction: typeof SHIFT_FORWARD | typeof SHIFT_BACKWARD, wrap: boolean) : void {
    // shifts the strip in the appropriate direction.

    const wrap_val = wrap ? PIXEL_SHIFT_WRAP : 0;
    const data : number[] = [];
    data[0] = START_SYSEX;
    data[1] = PIXEL_COMMAND;
    data[2] = PIXEL_SHIFT;
    data[3] = (amt | direction | wrap_val) & FIRMATA_7BIT_MASK;
    data[4] = END_SYSEX;

    this.port.write(Buffer.from(data));
  }
}
