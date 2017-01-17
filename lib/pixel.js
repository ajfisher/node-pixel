"use strict";

// Defines a set of WS2812 LED Pixels for use

// TODO:
// Pixels can be arranged into different structures // NICE TO HAVE
// Do we have a grid which can be 1D, 2D or 3D and any size
// Pixels needs to have a length, various deets on where it is (clock etc)
// Keyframing // NICE TO HAVE
// Pixel grid should be able to:
//      - Set pixels in a range from X->Y a colour

var ColorString = require("color-string"); // used for color parsing
var events = require("events");
var util = require("util");

// create a helper to output an int so messages can be shorter
ColorString.colorValue = function colorValue (colors, g_table) {
    // colors are assumed to be an array of [r, g, b] bytes
    // colorValue returns a packed value able to be pushed to firmata rather than
    // text values.
    // if gtable is passed then it should use the supplied gamma
    // correction table to correct the received value.

    // before sending, account for gamma correction.
    colors[0] = g_table[colors[0]];
    colors[1] = g_table[colors[1]];
    colors[2] = g_table[colors[2]];

    return ((colors[0] << 16) + (colors[1] << 8) + (colors[2]));
}

// CONSTANTS
const START_SYSEX = 0xF0,
STRING_DATA =       0x71,
END_SYSEX =         0xF7,
FIRMATA_7BIT_MASK = 0x7F,
PIXEL_SHIFT_WRAP =  0x40,
PIXEL_COMMAND =     0x51,
PIXEL_OFF =         0x00,
PIXEL_CONFIG =      0x01,
PIXEL_SHOW =        0x02,
PIXEL_SET_PIXEL =   0x03,
PIXEL_SET_STRIP =   0x04,
PIXEL_SHIFT =       0x05,
SHIFT_FORWARD =     0x20,
SHIFT_BACKWARD =    0x00;

const MAX_STRIPS = 8;

const PIN_DEFAULT = 6; // use this if not supplied

const I2C_DEFAULT =   0x42;

const GAMMA_DEFAULT = 1.0; // set to 1.0 in 0.9, 2.8 in 0.10

var Controllers = {
    FIRMATA: {
        initialize: {
            value: function(opts) {

                var MAX_PIXELS = 216; // based on # bytes available in firmata
                var strip_length = opts.length || 6; // just an arbitrary val
                var data_pin = opts.data || PIN_DEFAULT;
                var color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB
                var strip_definition = opts.strips || new Array();
                // do firmata / IO checks
                var firmata = opts.firmata || undefined;
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
                    let err = new Error("A firmata or board object is required");
                    err.name = "NoFirmataError";
                    throw err;
                }

                if (firmata.firmware.name !== 'node_pixel_firmata.ino') {
                    let err = new Error("Please upload NodePixel Firmata to the board");
                    err.name = "IncorrectFirmataVersionError";
                    throw err;
                }

                // figure out where we are writing to
                var port = firmata.sp || firmata;

                if (port.write === undefined) {
                    let err = new Error("Node Pixel FIRMATA controller requires IO that can write out");
                    err.name = "NoWritablePortError";
                    throw err;
                }

                var gamma = opts.gamma || GAMMA_DEFAULT; // Changing to 2.8 in v0.10

                // set up the gamma table
                var gtable = create_gamma_table(256, gamma, this.dep_warning.gamma);



                // work out the map of strips and pixels.
                if (typeof(strip_definition[0]) == "undefined") {
                    // there is nothing specified so it's probably a single strip
                    // using the length and pin shorthand
                    strip_definition.push( {
                        pin: data_pin,
                        color_order: color_order,
                        length: strip_length,
                    });
                }

                // put in check if it's gone over value
                if (strip_definition.length > MAX_STRIPS) {
                    var err = new RangeError("Maximum number of strips " + MAX_STRIPS + " exceeded");
                    this.emit("error", err);
                }

                var total_length = 0;
                strip_definition.forEach(function(data) {
                    total_length += data.length;
                });

                // put in check if there are too many pixels.
                if (total_length > MAX_PIXELS) {
                    var err = new RangeError("Maximum number of pixels " + MAX_PIXELS + " exceeded");
                    this.emit("error", err);
                }

                var pixels = [];

                for (var i=0; i< total_length; i++) {
                    pixels.push(new Pixel({
                        addr: i,
                        firmata: firmata,
                        port: port,
                        controller: "FIRMATA",
                        strip: this,
                    }) );
                }

                strips.set(this, {
                    pixels: pixels,
                    data: data_pin,
                    firmata: firmata,
                    port: port,
                    gtable: gtable,
                    gamma: gamma,
                });

                // now send the config message with length and data point.
                var data   = [];

                data[0] = START_SYSEX;
                data[1] = PIXEL_COMMAND;
                data[2] = PIXEL_CONFIG;
                strip_definition.forEach(function(strip) {
                    data.push( (strip.color_order << 5) | strip.pin);
                    data.push( strip.length & FIRMATA_7BIT_MASK);
                    data.push( (strip.length >> 7) & FIRMATA_7BIT_MASK);
                });
                data.push(END_SYSEX);

                port.write(new Buffer(data), function(error, res) {
                    var err = null;
                    if (error) {
                        err = error;
                        this.emit("error", err);
                    }
                    // there is a weird bug in OSX which sometimes causes
                    // a segfault if you try to write to fast. As such
                    // just delay the ready event by 1msec because even this
                    // is faster than hooman will perceive as a delay
                    setTimeout(() => {
                        this.emit("ready", err);
                    }, 1);

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

                // now just write that to the port and it should show the frame.
                strip.port.write(new Buffer(data));
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

                strip.port.write(new Buffer(data));
            },
        },
        _shift: {
            value: function(amt, direction, wrap) {
                // shifts the strip in the appropriate direction.
                //
                let wrap_val = wrap ? PIXEL_SHIFT_WRAP : 0;
                let strip = strips.get(this);
                let data = [];
                data[0] = START_SYSEX;
                data[1] = PIXEL_COMMAND;
                data[2] = PIXEL_SHIFT;
                data[3] = (amt | direction | wrap_val) & FIRMATA_7BIT_MASK;
                data[4] = END_SYSEX;

                strip.port.write(new Buffer(data));
            },
        },
    },
    I2CBACKPACK: {
        initialize: {
            value: function(opts) {

                var MAX_PIXELS = 500; // based on # bytes available in firmata
                var strip_length = opts.length || 6; // just an arbitrary val
                var strip_definition = opts.strips || new Array();
                var color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB
                var gamma = opts.gamma || GAMMA_DEFAULT; // Changing to 2.8 in v0.10

                // set up the gamma table
                var gtable = create_gamma_table(256, gamma, this.dep_warning.gamma);

                var io = opts.firmata || opts.board.io;

                if (!opts.address) {
                    opts.address = I2C_DEFAULT;
                }

                if (io == undefined) {
                    let err = new Error("An IO object is required to I2C controller");
                    err.name = "NoIOError";
                    throw err;
                }

                // work out the map of strips and pixels.
                if (typeof(strip_definition[0]) == "undefined") {
                    // there is nothing specified so it's probably a single strip
                    // using the length and colour type.
                    strip_definition.push( {
                        color_order: color_order,
                        length: strip_length,
                    });
                } else if (parseInt(strip_definition[0]) != NaN) {
                    // we have the array of pin lengths but do we have the colour

                    for (var i = 0; i< strip_definition.length; i++) {
                        var len = strip_definition[i];
                        strip_definition[i] = {
                            color_order: color_order,
                            length: len,
                        };
                    }
                }

                // put in check if it's gone over.
                if (strip_definition.length > MAX_STRIPS) {
                    var err = new RangeError("Maximum number of strips " + MAX_STRIPS + " exceeded");
                    this.emit("error", err);
                }

                var total_length = 0;
                strip_definition.forEach(function(data) {
                    total_length += data.length;
                });

                // put in check if there are too many pixels.
                if (total_length > MAX_PIXELS) {
                    var err = new RangeError("Maximum number of pixels " + MAX_PIXELS + " exceeded");
                    this.emit("error", err);
                }

                var pixels = [];

                for (var i=0; i < total_length; i++) {
                    pixels.push(new Pixel({
                        addr: i,
                        io: io,
                        controller: "I2CBACKPACK",
                        i2c_address: opts.address,
                        strip: this,
                    }) );
                }

                strips.set(this, {
                    pixels: pixels,
                    io: io,
                    i2c_address: opts.address,
                    gtable: gtable,
                    gamma: gamma,
                });

                // now send the config message with length and data point.
                var data   = [];

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
                        if (e instanceof Error && e.name == "EIO") {
                            this.emit("np_i2c_write_error", data);
                        }
                    }
                    process.nextTick(function() {
                        this.emit("ready", null)
                    }.bind(this) );
                }.bind(this) );
            },
        },
        show: {
            value: function() {
                var strip = strips.get(this);
                try {
                    strip.io.i2cWrite(strip.i2c_address, [PIXEL_SHOW]);
                } catch (e) {
                    if (e instanceof Error && e.name == "EIO") {
                        this.emit("np_i2c_write_error", "PIXEL_SHOW");
                    }
                }
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
                try {
                    strip.io.i2cWrite(strip.i2c_address, data);
                } catch (e) {
                    if (e instanceof Error && e.name == "EIO") {
                        this.emit("np_i2c_write_error", data);
                    }
                }
            },
        },
        _shift: {
            value: function(amt, direction, wrap) {
                // shifts the strip in the appropriate direction.
                //
                let wrap_val = wrap ? PIXEL_SHIFT_WRAP : 0;
                let strip = strips.get(this);
                let data = [];
                data[0] = PIXEL_SHIFT;
                data[1] = (amt | direction | wrap_val) & FIRMATA_7BIT_MASK;
                try {
                    strip.io.i2cWrite(strip.i2c_address, data);
                } catch (e) {
                    if (e instanceof Error && e.name == "EIO") {
                        this.emit("np_i2c_write_error", data);
                    }
                }
            },
        },
    },
};

// helper function for building gamma values
function create_gamma_table(steps, gamma, warning) {
    // used to build a gamma table for a particular value

    if (! warning && gamma == GAMMA_DEFAULT && ! global.IS_TEST_MODE) {
        console.info("INFO: Default gamma behaviour is changing");
        console.info("0.9 - gamma=1.0 - consistent with pre-gamma values");
        console.info("0.10 - gamma=2.8 - default fix for WS2812 LEDs");
        warning = true;
    }

    var g_table = new Array(steps);
    for (let i = 0; i < steps; i++) {
        g_table[i] = Math.floor(Math.pow((i / 255.0), gamma) * 255 + 0.5);
    }

    return g_table;
}

var strips = new WeakMap();

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

    var controller;

    if (typeof opts.controller === "string") {
        controller = Controllers[opts.controller];
    } else {
        controller = opts.controller || Controllers["FIRMATA"];
    }

    this.dep_warning = {
        stripLength: false,
        gammaValue: (! typeof opts.gamma === 'undefined'),
    };

    Object.defineProperties(this, controller);

    Object.defineProperty(this, 'length', {
        get: function() {
            let strip = strips.get(this);
            return strip.pixels.length;
        },
    });

    Object.defineProperty(this, 'gamma', {
        get: function() {
            let strip = strips.get(this);
            return strip.gamma;
        },
    });

    Object.defineProperty(this, 'gtable', {
        get: function() {
            let strip = strips.get(this);
            return strip.gtable;
        },
    });

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
        if(typeof(color) === "object") {
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

        for (var i = 0; i < strip.pixels.length; i++) {
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

        let strip = strips.get(this);

        // take a copy of the pixels at the end that is being towards
        let start_element = 0;
        if (direction == SHIFT_FORWARD) {
            start_element = this.length - amt;
        }
        let tmp_pixels = strip.pixels.splice(start_element, amt);

        while (tmp_pixels.length > 0) {
            let px = tmp_pixels.pop();

            // set the pixel off if not wrapping.
            if (! wrap) {
                px.color("#000");
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

    let strip = strips.get(this);

    if (! this.dep_warning.stripLength) {
        console.info("ERROR: strip.stripLength() is deprecated in favour of strip.length");
        console.info("0.8 - notice");
        console.info("0.9 - error");
        console.info("0.10 - removal");
        this.dep_warning.stripLength = true;
    }

    throw new Error({
        name: "NotImplemented",
        message: "stripLength is no longer supported, use strip.length",
        toString: function() { return "NotImplemented: stripLength is no longer supported" },
    });
};

var pixels = new WeakMap();

// controllers for the pixel side as well.
var Pixel_Controllers = {
    FIRMATA: {
        initialize: {
            value: function(opts) {
                // initialises the base object

                var pixel = {
                    address: opts.addr,
                    id: opts.addr,
                    color: {
                        r: 0, g: 0, b: 0, hexcode: "#000000", color: "black", rgb: [0,0,0],
                    },
                    firmata: opts.firmata,
                    port: opts.port,
                    parent: opts.strip,
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
                data.push(pixel.address & FIRMATA_7BIT_MASK);
                data.push((pixel.address >> 7) & FIRMATA_7BIT_MASK);
                data.push(color & FIRMATA_7BIT_MASK);
                data.push((color >> 7) & FIRMATA_7BIT_MASK);
                data.push((color >> 14) & FIRMATA_7BIT_MASK);
                data.push((color >> 21) & FIRMATA_7BIT_MASK);
                data.push(END_SYSEX);

                pixel.port.write(new Buffer(data));
            },
        },
    },
    I2CBACKPACK: {
        initialize: {
            value: function(opts) {
                // initialises the base object

                var pixel = {
                    address: opts.addr,
                    id: opts.addr,
                    color: {
                        r: 0, g: 0, b: 0, hexcode: "#000000", color: "black", rgb: [0,0,0],
                    },
                    io: opts.io,
                    i2c_address: opts.i2c_address,
                    parent: opts.strip
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
                data.push(pixel.address & FIRMATA_7BIT_MASK);
                data.push((pixel.address >> 7) & FIRMATA_7BIT_MASK);
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

    // we can assume this is set because the controller is set by the strip.
    var controller = Pixel_Controllers[opts.controller];

    Object.defineProperties(this, controller);

    // we use this to be able to update the address of the
    // pixel in the array if we do shift operations.
    Object.defineProperty(this, 'address', {
        get: function() {
            let pixel = pixels.get(this);
            return pixel.address;
        },
        set: function(newAddress) {
            let pixel = pixels.get(this);
            pixel.address = newAddress;
        },
    });

    pixels.set(this, this.initialize(opts));
}

Pixel.prototype.off = Pixel.prototype.clear = function () {
    // sets the pixel value to [0, 0, 0]. Equivalent to calling
    // `strip.off()` but for an individual pixel.
    this.color([0, 0, 0]);
}

Pixel.prototype.colour = Pixel.prototype.color = function(color, opts) {
    // use a particular form to set the color either
    // color = hex value or named colors or array of colors
    // opts can contain _sendmsg_ as bool. If set to false message won't be
    // sent to firmata - useful for strip level updates to keep message choke down

    var pixel = pixels.get(this);

    var options = opts || {};
    var sendmsg = true;
    if (options.sendmsg != undefined) { sendmsg = options.sendmsg; }

    var pixelcolor = null;

    if (color) {
        // get the color based on a string
        if(typeof(color) === "object") {
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


        //console.log(pixel.parent.gtable);
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

var COLOR_ORDER = {
    GRB: 0x00,
    RGB: 0x01,
    BRG: 0x02,
};

module.exports = {
    Strip: Strip,
    COLOR_ORDER: COLOR_ORDER,
    FORWARD: SHIFT_FORWARD,
    BACKWARD: SHIFT_BACKWARD,
};
