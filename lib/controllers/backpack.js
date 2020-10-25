const {
  PIXEL_SHIFT_WRAP,
  PIXEL_CONFIG,
  PIXEL_SHOW,
  PIXEL_SET_STRIP,
  PIXEL_SHIFT,
  MAX_STRIPS,
  I2C_DEFAULT,
  COLOR_ORDER,
  GAMMA_DEFAULT,
  FIRMATA_7BIT_MASK
} = require('../constants');
const { Pixel } = require('../pixel');
const { create_gamma_table } = require('../utils');

const IC2Backpack = {
  initialize: {
    value(opts, strips) {
      const MAX_PIXELS = 500; // based on # bytes available in firmata
      const strip_length = opts.length || 6; // just an arbitrary val
      const strip_definition = opts.strips || new Array();
      const color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB
      const gamma = opts.gamma || GAMMA_DEFAULT; // Changing to 2.8 in v0.10

      // set up the gamma table
      const gtable = create_gamma_table(256, gamma, this.dep_warning.gamma);

      const io = opts.firmata || opts.board.io;

      if (!opts.address) {
        opts.address = I2C_DEFAULT;
      }

      if (io == undefined) {
        const err = new Error('An IO object is required to I2C controller');
        err.name = 'NoIOError';
        throw err;
      }

      // work out the map of strips and pixels.
      if (typeof(strip_definition[0]) == 'undefined') {
        // there is nothing specified so it's probably a single strip
        // using the length and colour type.
        strip_definition.push( {
          color_order,
          length: strip_length
        });
      } else if (parseInt(strip_definition[0], 10) != NaN) {
        // we have the array of pin lengths but do we have the colour

        for (let i = 0; i< strip_definition.length; i++) {
          const len = strip_definition[i];
          strip_definition[i] = {
            color_order,
            length: len
          };
        }
      }

      // put in check if it's gone over.
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

      for (let i=0; i < total_length; i++) {
        pixel_list.push(new Pixel({
          addr: i,
          io,
          controller: 'I2CBACKPACK',
          i2c_address: opts.address,
          strip: this
        }, strips) );
      }

      strips.set(this, {
        pixels: pixel_list,
        io,
        i2c_address: opts.address,
        gtable,
        gamma
      });

      this.strips_internal = strips;

      // now send the config message with length and data point.
      const data   = [];

      data.push(PIXEL_CONFIG);
      strip_definition.forEach(function(strip) {
        data.push( (strip.color_order << 5) | strip.pin);
        data.push( strip.length & FIRMATA_7BIT_MASK);
        data.push( (strip.length >> 7) & FIRMATA_7BIT_MASK);
      });
      // send the I2C config message.
      io.i2cConfig(opts);
      process.nextTick(function() {
        try {
          io.i2cWrite(opts.address, data);
        } catch (e) {
          if (e instanceof Error && e.name == 'EIO') {
            this.emit('np_i2c_write_error', data);
          }
        }
        process.nextTick(function() {
          this.emit('ready', null)
        }.bind(this) );
      }.bind(this) );
    }
  },
  show: {
    value() {
      const strip = this.strips_internal.get(this);
      try {
        strip.io.i2cWrite(strip.i2c_address, [PIXEL_SHOW]);
      } catch (e) {
        if (e instanceof Error && e.name == 'EIO') {
          this.emit('np_i2c_write_error', 'PIXEL_SHOW');
        }
      }
    }
  },
  strip_color: {
    value(color) {
      const strip = this.strips_internal.get(this);
      const data   = [];

      data[0] = PIXEL_SET_STRIP;

      data[1] = color & FIRMATA_7BIT_MASK;
      data[2] = (color >> 7) & FIRMATA_7BIT_MASK;
      data[3] = (color >> 14) & FIRMATA_7BIT_MASK;
      data[4] = (color >> 21) & FIRMATA_7BIT_MASK;
      try {
        strip.io.i2cWrite(strip.i2c_address, data);
      } catch (e) {
        if (e instanceof Error && e.name == 'EIO') {
          this.emit('np_i2c_write_error', data);
        }
      }
    }
  },
  _shift: {
    value(amt, direction, wrap) {
      // shifts the strip in the appropriate direction.
      //
      const wrap_val = wrap ? PIXEL_SHIFT_WRAP : 0;
      const strip = this.strips_internal.get(this);
      const data = [];
      data[0] = PIXEL_SHIFT;
      data[1] = (amt | direction | wrap_val) & FIRMATA_7BIT_MASK;
      try {
        strip.io.i2cWrite(strip.i2c_address, data);
      } catch (e) {
        if (e instanceof Error && e.name == 'EIO') {
          this.emit('np_i2c_write_error', data);
        }
      }
    }
  }
}

module.exports = {
  IC2Backpack
}
