// Defines a set of WS2812 LED Pixels for use

// TODO:
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

var MAX_STRIPS = 8;

var PIN_DEFAULT = 6; // use this if not supplied

var I2C_DEFAULT =   0x42;

var Controllers = {
    FIRMATA: {
        initialize: {
            value: function(opts) {

                var MAX_PIXELS = 192; // based on # bytes available in firmata
                var strip_length = opts.length || 6; // just an arbitrary val
                var data_pin = opts.data || PIN_DEFAULT;
                var firmata = opts.firmata || opts.board.io;
                var color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB
                var strip_definition = opts.strips || new Array();

                if (firmata == undefined) {
                    throw "Either a firmata or board object is required";
                    return;
                }

                // figure out where we are writing to
                var port = firmata.sp || firmata;

                if (port.write === undefined) {
                    throw "Node Pixel FIRMATA controller only supports firmata IO that can write out";
                    return;
                }

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

                // put in check if it's gone over.
                if (strip_definition.length > MAX_STRIPS) {
                    var err = new RangeError("Maximum number of strips " + MAX_STRIPS + " exceeded");
                    this.emit("error", err);
                    return;
                }

                var total_length = 0;
                strip_definition.forEach(function(data) {
                    total_length += data.length;
                });

                // put in check if there are too many pixels.
                if (total_length > MAX_PIXELS) {
                    var err = new RangeError("Maximum number of pixels " + MAX_PIXELS + " exceeded");
                    this.emit("error", err);
                    return;
                }

                var pixels = [];

                for (var i=0; i< total_length; i++) {
                    pixels.push(new Pixel({
                        addr: i,
                        firmata: firmata,
                        port: port,
                        controller: "FIRMATA",
                    }) );
                }

                strips.set(this, {
                    pixels: pixels,
                    data: data_pin,
                    firmata: firmata,
                    port: port,
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
                        return;
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
    },
    I2CBACKPACK: {
        initialize: {
            value: function(opts) {

                var MAX_PIXELS = 500; // based on # bytes available in firmata
                var strip_length = opts.length || 6; // just an arbitrary val
                var strip_definition = opts.strips || new Array();
                var color_order = opts.color_order || COLOR_ORDER.GRB; // default GRB

                var io = opts.firmata || opts.board.io;

                if (!opts.address) {
                    opts.address = I2C_DEFAULT;
                }

                if (io == undefined) {
                    throw "An IO object is required to I2C controller";
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
                    return;
                }

                var total_length = 0;
                strip_definition.forEach(function(data) {
                    total_length += data.length;
                });

                // put in check if there are too many pixels.
                if (total_length > MAX_PIXELS) {
                    var err = new RangeError("Maximum number of pixels " + MAX_PIXELS + " exceeded");
                    this.emit("error", err);
                    return;
                }

                var pixels = [];

                for (var i=0; i < total_length; i++) {
                    pixels.push(new Pixel({
                        addr: i,
                        io: io,
                        controller: "I2CBACKPACK",
                        i2c_address: opts.address,
                    }) );
                }

                strips.set(this, {
                    pixels: pixels,
                    io: io,
                    i2c_address: opts.address,
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
                    io.i2cWrite(opts.address, data);
                    process.nextTick(function() {
                        this.emit("ready", null)
                    }.bind(this) );
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
        if(typeof(color) === "object") {
            // we have an RGB array value
            color = ColorString.hexString(color)
        }

        stripcolor = ColorString.getRgb(color) || null;
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

Strip.prototype.off = Strip.prototype.clear = function() {
    // sets the strip to 'black', effectively setting it to 'off'
    this.color([0, 0, 0]);
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
                    port: opts.port
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

                pixel.port.write(new Buffer(data));
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
            // we have RGB array value
            color = ColorString.hexString(color);
        }
        pixelcolor = ColorString.getRgb(color) || null;
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
        console.log("Color supplied couldn't be parsed: " + pixelcolor);
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
};
