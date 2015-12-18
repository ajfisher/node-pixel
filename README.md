# Node Pixel

![](https://img.shields.io/npm/v/node-pixel.svg)
[![Join the chat at https://gitter.im/ajfisher/node-pixel](https://img.shields.io/badge/Gitter-Join%20Chat-brightgreen.svg)](https://gitter.im/ajfisher/node-pixel?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![](https://img.shields.io/badge/status-Ready-green.svg)
![](https://img.shields.io/david/ajfisher/node-pixel.svg)
![](https://img.shields.io/github/issues/ajfisher/node-pixel.svg)

The purpose of this library is to provide a node js interface for addressable
RGB LEDs. Most commonly these are known as Neo Pixels (if you shop at Adafruit)
however any WS2812b addressable LED should work with this library.

The current iteration supports two methods of set up:

* a custom version of firmata that provides an interface to talk to the "pixels".
* an I2C "backpack" using an arduino pro mini or nano that provides the interface
and control of the pixels and then the IO controller talks to this backpack over
I2C messages.

The pixel library can be used with both Johnny-Five or stock Node Firmata and
can be used by any board that provides an IO interface with I2C support such as
a Raspberry PI.

Both fimwares are provided in this repo in the
[firmware/build](firmware/build) directory.

## Getting help

If you need some help getting your pixel strip working with johnny five jump into
the [Gitter Chat](https://gitter.im/ajfisher/node-pixel) or reach out to
[ajfisher on twitter](http://twitter.com/ajfisher) or just raise an
[issue here.](https://github.com/ajfisher/node-pixel/issues)

## Installation

Installation of both backpack and custom firmata are covered in detail in the
[Installation Guide](docs/installation.md).

### A note on multiple strips

Multiple led strips on one arduino or backpack are supported up to a maximum
of 8 individual strips (8 pins in use at once). Each strip can be different
lengths but you can only have a maximum of 192 pixels for Firmata and about
500 pixels for the backpack version.

Multiple strips connected to a single board or backpack are for the purposes
of node-pixel considered to be a single strip and are joined together in sequence
in the order that you define them.

On a backpack, the strips are defined sequentially from pin 0-7 on the backpack.

On an arduino, each strip can be defined with an individual pin which doesn't
need to be sequential (eg you can use pin 3, then pin 9, then pin 7).

One thing to note is that the timings on these strips are quite tight and you
will reach an upper limit of how much data you can push to the board controlling
the pixels (all that RGB data going over the wire) and the sheer number of
pixels you can refresh quickly (each pixel is written "in turn"). As such,
you may run into some blocking conflicts. These are discussed in
[this issue](https://github.com/ajfisher/node-pixel/issues/15).

## Pixel API

The Pixel API is provided below.

### Strip

A sequence of LEDs collected together is called a `strip`. A strip has
a controller to tell it to use the custom firmata or I2C backpack. A `strip`
can be a single physical strip in which case a single `pin` and `length` can
be provided. Otherwise it is made up of multiple physical strips, each of which
have their own `pin` and `length` and are composed together into order by using
the `strips` array as part of the definition of the object.

For the purposes of interaction however, once a `strip` is defined, it is all
one logical unit and the firmware will take care of writing data in the right
order, performing optimisations for strips that have or haven't changed and
writing in sequence or parallel as appropriate.

#### Parameters

* **options** An object of property parameters

| Property | Type | Value / Description | Default | Required |
|----------|------|---------------------|---------|----------|
| pin | Number | Digital Pin. Used to set which pin the signal line to the pixels is being used when using a single strip. | 6 | no (4) |
| length | Number | Number of pixels to be set on a single strip or all strips if individual lengths are not defined in the `strips` array | 32 | no (5) |
| color_order | Constant | Determines the order of the RGB values against the pixels. Can be GRB, RGB or BRG  | pixel.COLOR_ORDER.GRB | no (6) |
| strips | Array | Array of pin and length objects or array of length objects | 6 | no (2)(3) |
| board | IO Object | IO Board object to use with Johnny Five | undefined | yes(1) |
| firmata | Firmata board | Firmata board object to use with Firmata directly | undefined | yes(1) |
| controller | String | I2CBACKPACK, FIRMATA | FIRMATA | no |

(1) A board or firmata object is required but only one of these needs to be set.

(2) If using a backpack use an array of lengths eg `[8, 8, 8]` which would set
pins 0, 1 & 2 on the backpack to have strips of length 8 each on them.

(3) If using custom firmata then use an array of objects eg
`[ {pin: 4, length: 8}, {pin: 10, length: 8}, {pin: 11, length: 8} ]`
which would set pins 4, 10 & 11 to have strips of length 8 on each of them.

(4) If not supplied, it is assumed a `strips` array will be provided with a
`pin` parameter for each object in the array.

(5) If not supplied, it is assumed a `strips` array will be provided with a
`length` parameter for each object in the array.

(6) If supplied it will apply to all `strips` unless overridden selectively in
the `strips` array eg `[ {color_order: pixel.COLOR_ORDER.RGB}, ..]`

#### Events

* `onready()` -  emits when the `strip` is configured.
* `onerror()` - returns the error that occurred.

#### Examples

_Johnny-Five instantiation_

```javascript
pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board(opts);
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 4}, ], // this is preferred form for definition
    });

    strip.on("ready", function() {
        // do stuff with the strip here.
    });
});
```

_Firmata instantiation_

```javascript
pixel = require("node-pixel");
var firmata = require('firmata');

var board = new firmata.Board('path to usb',function(){

    strip = new pixel.Strip({
        pin: 6, // this is still supported as a shorthand
        length: 4,
        firmata: board,
        controller: "FIRMATA",
    });

    strip.on("ready", function() {
        // do stuff with the strip here.
    });
});
```

_Johnny Five with backpack_

```javascript
pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board(opts);

board.on("ready", function() {
    strip = new pixel.Strip({
        board: this,
        controller: "I2CBACKPACK",
        strips: [4, 6, 8], // 3 physical strips on pins 0, 1 & 2 with lengths 4, 6 & 8.
    });

    strip.on("ready", function() {
        // do stuff with the strip here.

    });
});
```

Note that Johnny-Five uses the board option and firmata uses the firmata option.
This is because the pixel library supports a Board capable of presenting an
IO interface. The library will work out the right thing to do based on the
board being passed and the controller being set.

#### Methods

##### show();

The show method should be called at the point you want to "set" the frame on
the strip of pixels and show them.

Note that when this method is called it will trigger the process that writes
the frame to the strips. If you have a very long strip of LEDs this may take
some time (assume 0.5ms per pixel) and is a blocking operation in most cases.

This gives you an upper limit as to how many frames you can drive per second.

###### Example

```javascript
// ... make pixel modifications

strip.show(); // make the strip latch and update the LEDs
```

Addressable LEDs work by clocking data along their entire length and so
you make the various changes you want to the strip as you need to without
triggering the display (like a frame buffer). Once you're ready you can then
call `show()` to propagate this data through the LEDs and display the frame.

##### off();

All LEDs on the strip can be turned off by using the `.off()` method. This effectively clears the current colours set on the strip.

`.clear()` is also aliased to the same method.

###### Example

```javascript
strip.off(); // turn the strip off / clear pixel colours
```

##### color( *colourstring* );

All LEDs on the strip can be set to the same colour using the `.color()` method.

`.colour()` is also aliased to the same method.

###### Parameters

* **colourstring** A `String` as a standard HTML hex colour or a CSS colour name,
or a CSS rgb(r, g, b) value used to specify the colour of the strip. Alternatively
an `Array` object as an rgb value eg `[r, g, b]`

###### Examples

_Set strip using a hex value_

```javascript
strip.color("#ff0000"); // turns entire strip red using a hex colour
strip.show();
```

_Update strip using a named CSS colour_

```javascript
strip.colour("teal"); // sets strip to a blue-green color using a named colour
strip.show();
```

_You can also use CSS RGB values_

```javascript
strip.color("rgb(0, 255, 0)"); // sets strip to green using rgb values
strip.show();
```

_Or set using an array of RGB values_

```javascript
strip.color([255, 255, 0]); // Sets strip using an array
strip.show();
```

##### pixel( *address* );

Individual pixels can be addressed by the pixel method using their address in
the sequence.

Note that if you have two physical strips of 8 and 10 then `pixel(10)` will be
the third pixel on the second physical strip.

###### Parameter

* **address** A `Number` indexing the pixel you want. Returns a `Pixel` object.

###### Example

```javascript
var p = strip.pixel(1); // get the second LED. p is now a Pixel object
```

### Pixel

A pixel is an individual element in the strip. It is fairly basic and it's API
is detailed below.

#### Methods

##### color( *color string* )

Colors work exactly the same way on individual pixels as per strips so see the
`strip.color` reference above.

`.colour()` is aliased to this method as well.

###### Parameters

* **color string** A `String` providing the hex colour, CSS colour name or CSS
rgb() values to be used to set the individual pixel a certain colour. You can also
pass in an `Array` object that is a set of RGB values as [r, g, b].

###### Examples

```javascript
var p = strip.pixel(1);     // get second LED
p.color("#0000FF");         // set second pixel blue.

p = strip.pixel(2);         // get third LED
p.colour("orange");          // set third pixel red/yellow

p = strip.pixel(3);         // get fourth LED
p.color("rgb(0, 255, 0)");  // set fourth LED green

p = strip.pixel(4);         // get fifth LED
p.color([255, 0, 255]);     // set fifth LED magenta
```

##### color()

Returns an object representing the color of this pixel with the shape below.

`.colour()` is aliased to this method as well.

###### Parameters

* none

###### Shape

```javascript
{
    r: 0,               // red component
    g: 0,               // green component
    b: 0,               // blue component
    hexcode: "#000000", // hexcode of color
    color: "black",     // keyword name of color if matching
    rgb: [0,0,0],       // RGB component array
}
```

###### Example

Get a pixel, set it's colour and then query it's current state.

```javascript
var p = strip.pixel(1); // get second LED

p.color("#0000FF"); // set second pixel blue.

p.color(); // returns {r:0, g:0, b:255, hexcode:"#0000ff", color:"blue", rgb[0,0,255]}
```

## Detailed examples with circuits

* [Basic single strip using custom firmata](docs/firmata.md)
* [Basic single strip using Johnny Five Firmata](docs/johnnyfive.md)
* [Single strip using Johnny Five over I2C Backpack](docs/johnnyfive-i2c.md)
* [Mutiple strips using Johnny Five over firmata](docs/multipin.md)
* [Multiple strips using Johnny Five over I2C Backpack](docs/multipin-i2c.md)
* [Controlling a panel and using `strip.color()`](docs/panel.md)
* [Static rainbow with a single strip](docs/rainbow-static.md)
* [Dynamic rainbow over a single strip](docs/rainbow-dynamic.md)
* [Dynamic rainbow over multiple strips](docs/rainbow-dynamic-multipin.md)
* [Random pixels flowing down multiple strips](examples/mega-multipin.js)

## TODO and roadmap

This library is under active development and planned modifications are:

* Provide methods of having different shapes to the strips including 3D
* Prvide method of pixel selection using polar coordinates for circles and hexes
* Provide interchange support.
