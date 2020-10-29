const events = require('events');
const util = require('util');
const { ColorString } = require('./pixel');
const {
  SHIFT_FORWARD
} = require('./constants');
const { Firmata } = require('./controllers/firmata');
const { IC2Backpack } = require('./controllers/backpack');

const strips = new WeakMap();

const Controllers = {
  FIRMATA: Firmata,
  I2CBACKPACK: IC2Backpack
};

function Strip(opts) {
  // opts contains an object with.
  // data: data pin for the pixel strip // DEPRECATED will be phased out.
  // length: length of the pixel strip. // DEPRECATED, will be phased out.
  // board: johnny five board object.
  // controller: controller type to use
  // firmata: actual firmata object if using firmata
  // stripShape: an array that contains lengths or optionally data pins and
  // lengths for each of them.
  //      eg: [ [6, 30], [12, 20], [7, 10] ] which would be 3 strips attached
  //      to pins 6, 12 and 7 and make a strip 60 pixels long.
  //      Otherwise [ 30, 20, 10 ] which would be 3 strips on PORTD 0-2 but
  //      still a strip 60 pixels long
  // gamma: A user specified value for gamma correction for the strip.
  //      default is 1.0 but will be changed to 2.8 over versions

  if (!(this instanceof Strip)) {
    return new Strip(opts);
  }

  let controller;

  if (typeof opts.controller === 'string') {
    controller = Controllers[opts.controller];
  } else {
    controller = opts.controller || Controllers['FIRMATA'];
  }

  this.dep_warning = {
    stripLength: false,
    gammaValue: (! typeof opts.gamma === 'undefined')
  };

  Object.defineProperties(this, controller);

  Object.defineProperty(this, 'length', {
    get() {
      const strip = strips.get(this);
      return strip.pixels.length;
    }
  });

  Object.defineProperty(this, 'gamma', {
    get() {
      const strip = strips.get(this);
      return strip.gamma;
    }
  });

  Object.defineProperty(this, 'gtable', {
    get() {
      const strip = strips.get(this);
      return strip.gtable;
    }
  });

  if (typeof this.initialize === 'function') {
    this.initialize(opts, strips);
  }
}

util.inherits(Strip, events.EventEmitter);

Strip.prototype.pixel = function(addr) {
  const strip = strips.get(this);

  return strip.pixels[addr];
};

Strip.prototype.colour = Strip.prototype.color = function(color, opts) {
  // sets the color of the entire strip
  // use a particular form to set the color either
  // color = hex value or named colors
  // or set color null and set opt which is an object as {rgb: [rx, gx, bx]}
  // values where x is an 8-bit value (0-255);
  const strip = strips.get(this);

  let stripcolor = null;

  if (color) {
    // use text to determine the color
    if (typeof(color) === 'object') {
      // we have an RGB array value
      stripcolor = color;
    } else {
      try {
        stripcolor = ColorString.get(color).value;
      } catch (e) {
        if (e instanceof TypeError && ColorString.get(color) === null ) {
          stripcolor = null;
        }
      }
    }
  }

  if (stripcolor != null) {
    // fill out the values for the pixels and then update the strip

    for (let i = 0; i < strip.pixels.length; i++) {
      strip.pixels[i].color(color, {sendmsg: false});
    }

    // set the whole strip color to the appropriate int value
    this.strip_color(ColorString.colorValue(stripcolor, strip.gtable));
  } else {
    console.log("Supplied colour couldn't be parsed: " + color);
  }
}

Strip.prototype.off = Strip.prototype.clear = function() {
  // sets the strip to 'black', effectively setting it to 'off'
  this.color([0, 0, 0]);
  this.show();
};

Strip.prototype.shift = function(amt, direction, wrap) {
  // public version of the shift function independent of the controller.
  // this looks after the actual internal shifting of the pixels within the
  // js side and then calls the controller to mirror the same function.

  if (amt > 0) {
    const strip = strips.get(this);

    // take a copy of the pixels at the end that is being towards
    let start_element = 0;
    if (direction == SHIFT_FORWARD) {
      start_element = this.length - amt;
    }
    const tmp_pixels = strip.pixels.splice(start_element, amt);

    while (tmp_pixels.length > 0) {
      const px = tmp_pixels.pop();

      // set the pixel off if not wrapping.
      if (! wrap) {
        px.color('#000');
      }

      if (direction == SHIFT_FORWARD) {
        strip.pixels.unshift(px);
      } else {
        strip.pixels.push(px);
      }
    }

    // renumber the items so the addresses are correct for display
    strip.pixels.forEach((px, index) => {
      px.address = index;
    });

    // now get the firmware to update appropriately as well.
    this._shift(amt, direction, wrap);
  }
};

Strip.prototype.stripLength = function() {
  // gets the number of pixels in the strip
  if (! this.dep_warning.stripLength) {
    console.info('ERROR: strip.stripLength() is deprecated in favour of strip.length');
    console.info('0.8 - notice');
    console.info('0.9 - error');
    console.info('0.10 - removal');
    this.dep_warning.stripLength = true;
  }

  throw new Error({
    name: 'NotImplemented',
    message: 'stripLength is no longer supported, use strip.length',
    toString() { return 'NotImplemented: stripLength is no longer supported' }
  });
};

module.exports = {
  Strip
};
