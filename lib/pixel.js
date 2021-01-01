'use strict';

// Defines a set of WS2812 LED Pixels for use

// TODO:
// Pixels can be arranged into different structures // NICE TO HAVE
// Do we have a grid which can be 1D, 2D or 3D and any size
// Pixels needs to have a length, various deets on where it is (clock etc)
// Keyframing // NICE TO HAVE
// Pixel grid should be able to:
//      - Set pixels in a range from X->Y a colour

const ColorString = require('color-string'); // used for color parsing
const {
  START_SYSEX,
  END_SYSEX,
  FIRMATA_7BIT_MASK,
  PIXEL_COMMAND,
  PIXEL_SET_PIXEL
} = require('./constants');

function colorValue(colors, g_table) {
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

// create a helper to output an int so messages can be shorter
ColorString.colorValue = colorValue;

const pixels = new WeakMap();

const Pixel_Controllers = {
  FIRMATA: {
    initialize: {
      value(opts) {
        // initialises the base object

        const pixel = {
          address: opts.addr,
          id: opts.addr,
          color: {
            r: 0, g: 0, b: 0, hexcode: '#000000', color: 'black', rgb: [0,0,0]
          },
          firmata: opts.firmata,
          port: opts.port,
          parent: opts.strip
        };

        return pixel;
      }
    },
    pixel_color: {
      value(color) {
        // sets the actual pixel colour
        const pixel = pixels.get(this);

        const data   = [];

        data.push(START_SYSEX);
        data.push(PIXEL_COMMAND);
        data.push(PIXEL_SET_PIXEL);
        data.push(pixel.address & FIRMATA_7BIT_MASK);
        data.push((pixel.address >> 7) & FIRMATA_7BIT_MASK);
        data.push(color & FIRMATA_7BIT_MASK);
        data.push((color >> 7) & FIRMATA_7BIT_MASK);
        data.push((color >> 14) & FIRMATA_7BIT_MASK);
        data.push((color >> 21) & FIRMATA_7BIT_MASK);
        data.push(END_SYSEX);

        pixel.port.write(Buffer.from(data));
      }
    }
  },
  I2CBACKPACK: {
    initialize: {
      value(opts) {
        // initialises the base object

        const pixel = {
          address: opts.addr,
          id: opts.addr,
          color: {
            r: 0, g: 0, b: 0, hexcode: '#000000', color: 'black', rgb: [0,0,0]
          },
          io: opts.io,
          i2c_address: opts.i2c_address,
          parent: opts.strip
        };

        return pixel;
      }
    },
    pixel_color: {
      value(color) {
        // sets the actual pixel colour
        const pixel = pixels.get(this);

        const data   = [];

        data.push(PIXEL_SET_PIXEL);
        data.push(pixel.address & FIRMATA_7BIT_MASK);
        data.push((pixel.address >> 7) & FIRMATA_7BIT_MASK);
        data.push(color & FIRMATA_7BIT_MASK);
        data.push((color >> 7) & FIRMATA_7BIT_MASK);
        data.push((color >> 14) & FIRMATA_7BIT_MASK);
        data.push((color >> 21) & FIRMATA_7BIT_MASK);

        pixel.io.i2cWrite(pixel.i2c_address, data);
      }
    }
  }
};

function Pixel(opts, stripsInstance = new WeakMap()) {
  if (!(this instanceof Pixel)) {
    return new Pixel(opts, stripsInstance);
  }

  // we can assume this is set because the controller is set by the strip.
  const controller = Pixel_Controllers[opts.controller];

  Object.defineProperties(this, controller);

  // we use this to be able to update the address of the
  // pixel in the array if we do shift operations.
  Object.defineProperty(this, 'address', {
    get() {
      const pixel = pixels.get(this);
      return pixel.address;
    },
    set(newAddress) {
      const pixel = pixels.get(this);
      pixel.address = newAddress;
    }
  });

  pixels.set(this, this.initialize(opts, stripsInstance));
}

Pixel.prototype.off = Pixel.prototype.clear = function() {
  // sets the pixel value to [0, 0, 0]. Equivalent to calling
  // `strip.off()` but for an individual pixel.
  this.color([0, 0, 0]);
};

Pixel.prototype.colour = Pixel.prototype.color = function(color, opts) {
  // use a particular form to set the color either
  // color = hex value or named colors or array of colors
  // opts can contain _sendmsg_ as bool. If set to false message won't be
  // sent to firmata - useful for strip level updates to keep message choke down

  const pixel = pixels.get(this);

  const options = opts || {};
  let sendmsg = true;
  if (options.sendmsg != undefined) { sendmsg = options.sendmsg; }

  let pixelcolor = null;

  if (color) {
    // get the color based on a string
    if (typeof(color) === 'object') {
      // we have an RGB array value
      pixelcolor = {
        model: 'rgb',
        value: color
      };
    } else {
      pixelcolor = ColorString.get(color);
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
    pixel.color.rgb = pixelcolor.value;

    color = ColorString.colorValue(pixelcolor.value, pixel.parent.gtable);
    if (sendmsg) {
      // TODO probably should be pulling the color off the obj rather than
      // sending it to this function....
      this.pixel_color(color);
    }
  } else {
    console.log("Color supplied couldn't be parsed: " + color);
  }
};

// controllers for the pixel side as well.
module.exports = {
  Pixel,
  ColorString,
  colorValue
};
