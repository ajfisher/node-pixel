// Defines a set of WS2812 LED Pixels for use

// TODO:
//
// Pixels can be arranged into different structures // NICE TO HAVE
// Do we want to call it strip and pixels? 
// Do we have a grid which can be 1D, 2D or 3D and any size
// Pixels needs to have a length, various deets on where it is (clock etc)
// Pixels can be on a single pin or separate ones (possible with I2C as well)
// Accomodate for I2C or native firmata
// Deal with different pixel types
// Keyframing // NICE TO HAVE
// Pixel grid should be able to:
//      - Set pixels in a range from X->Y a colour
//
//
require("es6-collections");

var ColorString = require("color-string"); // used for color parsing

// create a helper to output an int so messages can be shorter
ColorString.colorValue = function colorValue (colors) {
    // colors are assumed to be an array of [r, g, b] bytes
    // colorValue returns a packed value able to be pushed to firmata rather than
    // text values.

    return ((colors[0] << 16) + (colors[1] << 8) + (colors[2]));
}

// FIRMATA CONSTANTS
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

var makeSysExString = function(message) {
// creates a sysex string message ready for sending

    var buffer = new Buffer(message + '\0', 'utf8');
    var data   = [];

    data.push(START_SYSEX);
    data.push(STRING_DATA);

    for (var index = 0, length = buffer.length; index < length; index ++) {
        data.push(buffer[index] & 0x7F);
        data.push((buffer[index] >> 7) & 0x7F);
    }

    data.push(END_SYSEX);

    // now just write that to the serialport and it should do things.
    return (data)
}

var strips = new WeakMap();

function Strip(opts) {

    // opts contains an object with.
    // data: data pin for the pixel strip
    // board: johnny five board object.
    // firmata: actual firmata object if preferred
    // length: length of the pixel strip.

    var strip_length = opts.length || 6; // just an arbitrary val

    var firmata = opts.firmata || opts.board.io;

    if (firmata == undefined) {
        throw "Either a firmata object or board object is required";
    }

    var pixels = [];

    for (var i=0; i< strip_length; i++) {
        pixels.push(new Pixel({
            //opts
            addr: i,
            firmata: firmata,
        }) );
    }

    if (opts.board != undefined && opts.board.io.name != "Firmata") {
        throw "RGBLED only supports firmata based devices";
        return;
    }

    strips.set(this, {
        pixels: pixels,
        data: opts.data || 6,
        firmata: firmata,
    });
}

Strip.prototype.pixel = function(addr) {
    var strip = strips.get(this);

    return strip.pixels[addr];
}

Strip.prototype.color = function(color, opts) {
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
    } else {
        console.log("color supplied couldn't be parsed: " + stripcolor);
    }
}


Strip.prototype.stripLength = function() {
    // gets the number of pixels in the strip
    var strip = strips.get(this);
    return (strip.pixels.length);
}



Strip.prototype.show = function() {
    // call the frame on the strip.
    var strip = strips.get(this);

    var data   = [];

    data[0] = START_SYSEX;
    data[1] = PIXEL_COMMAND;
    data[2] = PIXEL_SHOW;
    data[3] = END_SYSEX;

    // now just write that to the serialport and it should show the frame.
    strip.firmata.sp.write(new Buffer(data));
}


var pixels = new WeakMap();

function Pixel(opts) {

    pixels.set(this, {
        addr: opts.addr,
        color: {
            r: 0, g: 0, b: 0, hexcode: "#000000", color: "black", rgb: [0,0,0],
        },
        firmata: opts.firmata,
    });
}

Pixel.prototype.color = function(color, opts) {
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
        }
    } else {
        console.log("color supplied couldn't be parsed: " + pixelcolor);
    }
};

module.exports = { Strip: Strip};
