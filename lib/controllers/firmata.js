const {
  PIXEL_SHIFT_WRAP,
  PIXEL_CONFIG,
  PIXEL_SHOW,
  PIXEL_SET_STRIP,
  PIXEL_SHIFT,
  MAX_STRIPS,
  PIN_DEFAULT,
  COLOR_ORDER,
  GAMMA_DEFAULT,
  FIRMATA_7BIT_MASK,
  START_SYSEX,
  END_SYSEX,
  PIXEL_COMMAND
} = require('../constants');
const { create_gamma_table } = require('../utils');
const { Pixel } = require('../pixel');

const Firmata = {
  initialize: {
    value(opts, strips) {
      const MAX_PIXELS = 216; // based on # bytes available in firmata
      const strip_length = opts.length || 6; // just an arbitrary val
      const data_pin = opts.data || PIN_DEFAULT;
      const color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB
      const strip_definition = opts.strips || new Array();
      const skip_firmware_check = !!opts.skip_firmware_check;
      // do firmata / IO checks
      let firmata = opts.firmata || undefined;
      if (firmata == undefined) {
        try {
          firmata = opts.board.io;
        } catch (e) {
          if (e instanceof TypeError) {
            // there's no board
            firmata = undefined;
          }
        }
      }
      // check if we're *still* undefined
      if (firmata == undefined) {
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

      const gamma = opts.gamma || GAMMA_DEFAULT; // Changing to 2.8 in v0.10

      // set up the gamma table
      const gtable = create_gamma_table(256, gamma, this.dep_warning.gamma);


      // work out the map of strips and pixels.
      if (typeof(strip_definition[0]) == 'undefined') {
        // there is nothing specified so it's probably a single strip
        // using the length and pin shorthand
        strip_definition.push( {
          pin: data_pin,
          color_order,
          length: strip_length
        });
      }

      // put in check if it's gone over value
      if (strip_definition.length > MAX_STRIPS) {
        const err = new RangeError('Maximum number of strips ' + MAX_STRIPS + ' exceeded');
        this.emit('error', err);
      }

      let total_length = 0;
      strip_definition.forEach(function(data) {
        total_length += data.length;
      });

      // put in check if there are too many pixels.
      if (total_length > MAX_PIXELS) {
        const err = new RangeError('Maximum number of pixels ' + MAX_PIXELS + ' exceeded');
        this.emit('error', err);
      }

      const pixel_list = [];

      for (let i=0; i< total_length; i++) {
        pixel_list.push(new Pixel({
          addr: i,
          firmata,
          port,
          controller: 'FIRMATA',
          strip: this
        }, strips) );
      }

      strips.set(this, {
        pixels: pixel_list,
        data: data_pin,
        firmata,
        port,
        gtable,
        gamma
      });

      this.strips_internal = strips;

      // now send the config message with length and data point.
      const data   = [];

      data[0] = START_SYSEX;
      data[1] = PIXEL_COMMAND;
      data[2] = PIXEL_CONFIG;
      strip_definition.forEach(function(strip) {
        data.push( (strip.color_order << 5) | strip.pin);
        data.push( strip.length & FIRMATA_7BIT_MASK);
        data.push( (strip.length >> 7) & FIRMATA_7BIT_MASK);
      });
      data.push(END_SYSEX);

      port.write(Buffer.from(data), function(error, res) {
        let err = null;
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
      }.bind(this) );
    }
  },
  show: {
    value() {
      // call the frame on the strip.
      const strip = this.strips_internal.get(this);

      const data   = [];
      data[0] = START_SYSEX;
      data[1] = PIXEL_COMMAND;
      data[2] = PIXEL_SHOW;
      data[3] = END_SYSEX;

      // now just write that to the port and it should show the frame.
      strip.port.write(Buffer.from(data));
    }
  },
  strip_color: {
    value(color) {
      // colour work is already done this just sets it the appropriate
      // way.
      const strip = this.strips_internal.get(this);
      const data   = [];

      data[0] = START_SYSEX;
      data[1] = PIXEL_COMMAND;
      data[2] = PIXEL_SET_STRIP;
      data[3] = color & FIRMATA_7BIT_MASK;
      data[4] = (color >> 7) & FIRMATA_7BIT_MASK;
      data[5] = (color >> 14) & FIRMATA_7BIT_MASK;
      data[6] = (color >> 21) & FIRMATA_7BIT_MASK;
      data[7] = END_SYSEX;

      strip.port.write(Buffer.from(data));
    }
  },
  _shift: {
    value(amt, direction, wrap) {
      // shifts the strip in the appropriate direction.
      //
      const wrap_val = wrap ? PIXEL_SHIFT_WRAP : 0;
      const strip = this.strips_internal.get(this);
      const data = [];
      data[0] = START_SYSEX;
      data[1] = PIXEL_COMMAND;
      data[2] = PIXEL_SHIFT;
      data[3] = (amt | direction | wrap_val) & FIRMATA_7BIT_MASK;
      data[4] = END_SYSEX;

      strip.port.write(Buffer.from(data));
    }
  }
}

module.exports = {
  Firmata
}
