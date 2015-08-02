// Defines a set of WS2812 LED Pixels for use

// TODO:
//
// Pixels can be arranged into different structures // NICE TO HAVE
// Do we want to call it strip and pixels?
// Do we have a grid which can be 1D, 2D or 3D and any size
// Pixels needs to have a length, various deets on where it is (clock etc)
// Pixels can be on a single pin or separate ones (possible with I2C as well)
// Deal with different pixel types
// Keyframing // NICE TO HAVE
// Pixel grid should be able to:
//      - Set pixels in a range from X->Y a colour
//
//
require("es6-collections");

var ColorString = require("color-string"); // used for color parsing
var events = require("events");
var util = require("util");


// create a helper to output an int so messages can be shorter
ColorString.colorValue = function colorValue (colors) {
    // colors are assumed to be an array of [r, g, b] bytes
    // colorValue returns a packed value able to be pushed to firmata rather than
    // text values.

    return ((colors[0] << 16) + (colors[1] << 8) + (colors[2]));
}

// CONSTANTS
var START_SYSEX =   0xF0,
STRING_DATA =       0x71,
END_SYSEX =         0xF7,
FIRMATA_7BIT_MASK = 0x7F,
PIXEL_COMMAND =     0x51,
PIXEL_OFF =         0x00,
PIXEL_CONFIG =      0x01,
PIXEL_SHOW =        0x02,
PIXEL_SET_PIXEL =   0x03,
PIXEL_SET_STRIP =   0x04;

var PIN_DEFAULT = 6; // use this if not supplied

var I2C_DEFAULT =   0x42;

var Controllers = {
    FIRMATA: {
        initialize: {
            value: function(opts) {

                var strip_length = opts.length || 6; // just an arbitrary val
                var data_pin = opts.data || DEFAULT_PIN;
                var firmata = opts.firmata || opts.board.io;

                if (firmata == undefined) {
                    throw "Either a firmata object or board object is required";
                }

                var pixels = [];

                for (var i=0; i< strip_length; i++) {
                    pixels.push(new Pixel({
                        addr: i,
                        firmata: firmata,
                        controller: "FIRMATA"
                    }) );
                }

                if (opts.board != undefined && opts.board.io.name != "Firmata") {
                    throw "Node Pixel FIRMATA controller only supports firmata boards";
                    return;
                }

                strips.set(this, {
                    pixels: pixels,
                    data: 6,
                    firmata: firmata,
                });

                // now send the config message with length and data point.
                var data   = [];

                data[0] = START_SYSEX;
                data[1] = PIXEL_COMMAND;
                data[2] = PIXEL_CONFIG;
                data[3] = data_pin;
                data[4] = strip_length & FIRMATA_7BIT_MASK;
                data[5] = (strip_length >> 7) & FIRMATA_7BIT_MASK;
                data[6] = END_SYSEX;

                firmata.sp.write(new Buffer(data), function(error, res) {
                    var err = null;
                    if (error) {
                        err = error;
                        this.emit("error", err);
                    }
                    this.emit("ready", err);

                }.bind(this) );
            },
        },
        show: {
            value: function() {

                // call the frame on the strip.
                var strip = strips.get(this);

                var data   = [];
                data[0] = START_SYSEX;
                data[1] = PIXEL_COMMAND;
                data[2] = PIXEL_SHOW;
                data[3] = END_SYSEX;

                // now just write that to the serialport and it should show the frame.
                strip.firmata.sp.write(new Buffer(data));
            },
        },
        strip_color: {
            value: function(color) {
                // colour work is already done this just sets it the appropriate
                // way.
                var strip = strips.get(this);
                var data   = [];

                data[0] = START_SYSEX;
                data[1] = PIXEL_COMMAND;
                data[2] = PIXEL_SET_STRIP;
                data[3] = color & FIRMATA_7BIT_MASK;
                data[4] = (color >> 7) & FIRMATA_7BIT_MASK;
                data[5] = (color >> 14) & FIRMATA_7BIT_MASK;
                data[6] = (color >> 21) & FIRMATA_7BIT_MASK;
                data[7] = END_SYSEX;

                strip.firmata.sp.write(new Buffer(data));
            },
        },
    },
    I2CBACKPACK: {
        initialize: {
            value: function(opts) {

                var strip_length = opts.length || 6; // just an arbitrary val

                var io = opts.firmata || opts.board.io;
                var i2caddr = opts.address || I2C_DEFAULT;
                if (io == undefined) {
                    throw "An IO object is required to I2C controller";
                }

                var pixels = [];

                for (var i=0; i< strip_length; i++) {
                    pixels.push(new Pixel({
                        addr: i,
                        io: io,
                        controller: "I2CBACKPACK",
                        i2c_address: i2caddr,
                    }) );
                }

                strips.set(this, {
                    pixels: pixels,
                    io: io,
                    i2c_address: i2caddr,
                });

                // send the I2C config message.
                io.i2cConfig();
                process.nextTick(function() {
                    this.emit("ready", null)
                }.bind(this) );
            },
        },
        show: {
            value: function() {

                var strip = strips.get(this);
                strip.io.i2cWrite(strip.i2c_address, [PIXEL_SHOW]);
            },
        },
        strip_color: {
            value: function(color) {
                var strip = strips.get(this);
                var data   = [];

                data[0] = PIXEL_SET_STRIP;

                data[1] = color & FIRMATA_7BIT_MASK;
                data[2] = (color >> 7) & FIRMATA_7BIT_MASK;
                data[3] = (color >> 14) & FIRMATA_7BIT_MASK;
                data[4] = (color >> 21) & FIRMATA_7BIT_MASK;

                strip.io.i2cWrite(strip.i2c_address, data);
            },
        },
    },
};


var strips = new WeakMap();

function Strip(opts) {

    // opts contains an object with.
    // data: data pin for the pixel strip
    // board: johnny five board object.
    // controller: controller type to use
    // firmata: actual firmata object if preferred
    // length: length of the pixel strip.

    if (!(this instanceof Strip)) {
        return new Strip(opts);
    }

    var controller;

    if (typeof opts.controller === "string") {
        controller = Controllers[opts.controller];
    } else {
        controller = opts.controller || Controllers["FIRMATA"];
    }

    Object.defineProperties(this, controller);

    if (typeof this.initialize === "function") {
        this.initialize(opts);
    }

}

util.inherits(Strip, events.EventEmitter);

Strip.prototype.pixel = function(addr) {
    var strip = strips.get(this);

    return strip.pixels[addr];
};

Strip.prototype.colour = Strip.prototype.color = function(color, opts) {
    // sets the color of the entire strip
    // use a particular form to set the color either
    // color = hex value or named colors
    // or set color null and set opt which is an object as {rgb: [rx, gx, bx]}
    // values where x is an 8-bit value (0-255);
    var strip = strips.get(this);

    var stripcolor = null;

    if (color) {
        // use text to determine the color
        stripcolor = ColorString.getRgb(color) || null;

    } else if (opts) {
        // use rgb array to determine color
        stripcolor = opts.rgb || null;
    }

    if (stripcolor != null) {
        // fill out the values for the pixels and then update the strip

        for (var i = 0; i < strip.pixels.length; i++) {
            strip.pixels[i].color(color, {sendmsg: false});
        }

        color = ColorString.colorValue(stripcolor);

        this.strip_color(color);

    } else {
        console.log("color supplied couldn't be parsed: " + stripcolor);
    }
}


Strip.prototype.stripLength = function() {
    // gets the number of pixels in the strip
    var strip = strips.get(this);
    return (strip.pixels.length);
}

var pixels = new WeakMap();

// controllers for the pixel side as well.
var Pixel_Controllers = {
    FIRMATA: {
        initialize: {
            value: function(opts) {
                // initialises the base object

                var pixel = {
                    addr: opts.addr,
                    color: {
                        r: 0, g: 0, b: 0, hexcode: "#000000", color: "black", rgb: [0,0,0],
                    },
                    firmata: opts.firmata,
                };

                return pixel;
            },
        },
        pixel_color: {
            value: function(color) {
                // sets the actual pixel colour
                var pixel = pixels.get(this);

                var data   = [];

                data.push(START_SYSEX);
                data.push(PIXEL_COMMAND);
                data.push(PIXEL_SET_PIXEL);
                data.push(pixel.addr & FIRMATA_7BIT_MASK);
                data.push((pixel.addr >> 7) & FIRMATA_7BIT_MASK);
                data.push(color & FIRMATA_7BIT_MASK);
                data.push((color >> 7) & FIRMATA_7BIT_MASK);
                data.push((color >> 14) & FIRMATA_7BIT_MASK);
                data.push((color >> 21) & FIRMATA_7BIT_MASK);
                data.push(END_SYSEX);

                pixel.firmata.sp.write(new Buffer(data));
            },
        },
    },
    I2CBACKPACK: {
        initialize: {
            value: function(opts) {
                // initialises the base object

                var pixel = {
                    addr: opts.addr,
                    color: {
                        r: 0, g: 0, b: 0, hexcode: "#000000", color: "black", rgb: [0,0,0],
                    },
                    io: opts.io,
                    i2c_address: opts.i2c_address,
                };

                return pixel;
            },
        },
        pixel_color: {
            value: function(color) {
                // sets the actual pixel colour
                var pixel = pixels.get(this);

                var data   = [];

                data.push(PIXEL_SET_PIXEL);
                data.push(pixel.addr & FIRMATA_7BIT_MASK);
                data.push((pixel.addr >> 7) & FIRMATA_7BIT_MASK);
                data.push(color & FIRMATA_7BIT_MASK);
                data.push((color >> 7) & FIRMATA_7BIT_MASK);
                data.push((color >> 14) & FIRMATA_7BIT_MASK);
                data.push((color >> 21) & FIRMATA_7BIT_MASK);

                pixel.io.i2cWrite(pixel.i2c_address, data);
            },
        },
    },
};


function Pixel(opts) {

    if (!(this instanceof Pixel)) {
        return new Pixel(opts);
    }

    var controller;

    if (typeof opts.controller === "string") {
        controller = Pixel_Controllers[opts.controller];
    } else {
        controller = opts.controller || Pixel_Controllers["FIRMATA"];
    }

    Object.defineProperties(this, controller);

    pixels.set(this, this.initialize(opts));
}

Pixel.prototype.colour = Pixel.prototype.color = function(color, opts) {
    // use a particular form to set the color either
    // color = hex value or named colors
    // or set color null and set opt which is an object as {r:x, g:x, b:x}
    // values where x is an 8-bit value (0-255);
    // opts can contain _sendmsg_ as bool. If set to false message won't be
    // sent to firmata - useful for strip level updates to keep message choke down

    var pixel = pixels.get(this);

    var options = opts || {};
    var sendmsg = true;
    if (options.sendmsg != undefined) { sendmsg = options.sendmsg; }

    var pixelcolor = null;
    if (color) {
        // get the color based on a string
        pixelcolor = ColorString.getRgb(color) || null;
    } else if (opts) {
        // set using rgb value
        pixelcolor = options.rgb || null;
    } else {
        return pixel.color;
    }

    if (pixelcolor != null) {
        // fill out the values for the pixel and then send the message to update
        // it on the strip

        with (pixel.color) {
            r = pixelcolor[0];
            g = pixelcolor[1];
            b = pixelcolor[2];
            hexcode = ColorString.hexString(pixelcolor);
            color = ColorString.keyword(pixelcolor);
            rgb = pixelcolor;
        }

        color = ColorString.colorValue(pixelcolor);
        if (sendmsg) {
            this.pixel_color(color);
        }
    } else {
        console.log("color supplied couldn't be parsed: " + pixelcolor);
    }
};

module.exports = { Strip: Strip};
