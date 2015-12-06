# node-pixel

![](https://img.shields.io/badge/version-0.5.0-blue.svg)
[![Join the chat at https://gitter.im/ajfisher/node-pixel](https://img.shields.io/badge/Gitter-Join%20Chat-brightgreen.svg)](https://gitter.im/ajfisher/node-pixel?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![](https://img.shields.io/badge/status-Not%20ready-red.svg)
![](https://img.shields.io/david/ajfisher/node-pixel.svg)
![](https://img.shields.io/github/issues/ajfisher/node-pixel.svg)

The purpose of this library is to provide a node js interface for addressable RGB LEDs.
Most commonly these are known as Neo Pixels (if you shop at Adafruit) however
any WS2812b addressable LED should work with this.

The current iteration supports two methods of set up:

* a custom version of firmata that provides an interface to talk to the "pixels".
* an I2C "backpack" using an arduino pro mini or nano that provides the interface
and then uses standard firmata.

The pixel library can be used with both Johnny-Five or stock Node Firmata and
can be used by any board that provides an IO interface with I2C support such as
a Raspberry PI.

Both fimwares are provided in this repo in the firmware directory.

## Getting help

If you need some help getting your pixel strip working with johnny five jump into
the [Gitter Chat](https://gitter.im/ajfisher/node-pixel) or reach out to
[ajfisher on twitter](http://twitter.com/ajfisher) or just raise an issue here.

## Installation

Both methods of installation are covered in detail in the [Installation Guide](docs/installation.md).

### A note on multiple strips

Multiple led strips on one arduino or backpack are supported up to a maximum
of 8 individual strips. Each strip can be different lengths but you can only have
a maximum of 256 pixels for Firmata and about 900 pixels for the backpack version.

Multiple strips connected to a single board or backpack are for the purposes
of node-pixel considered to be a single strip and are joined together in sequence.

On a backpack, the strips are defined sequentially from pin 0-7 on the backpack.

On an arduino, each strip can be defined with an individual pin which doesn't
need to be sequential.

One thing to note is that currently because the memory and strips are
preallocated if you want to do tight timings with multiple strips working independently
you may run into some blocking conflicts. These are discussed in
[this issue](https://github.com/ajfisher/node-pixel/issues/15).

## Pixel API

The Pixel API is provided below.

### Strip

A sequence of LEDs all joined together is called a `strip` and you need to tell
the strip which `pin` (`data`) it is on and how many LEDs are in the sequence.
In addition you need to provide the strip with a controller to tell it to use
the custom firmata or I2C backpack.


#### Parameters

* **options** An object of property parameters

| Property | Type | Value / Description | Default | Required |
|----------|------|---------------------|---------|----------|
| pin | Number | Digital Pin. Used to set which pin the signal line to the pixels is being used when using a single strip. | 6 | yes |
| length | Number | Number of pixels to be set on a single strip. | 128 | no |
| pins | Array | Array of pin and length objects or array of length objects | 6 | no (2)(3) |
| board | IO Object | IO Board object to use with Johnny Five | undefined | yes(1) |
| firmata | Firmata board | Firmata board object to use with Firmata directly | undefined | yes(1) |
| controller | String | I2CBACKPACK, FIRMATA | FIRMATA | no |

(1) A board or firmata object is required but only one of these needs to be set.

(2) If using a backpack use an array of lengths eg `[8, 8, 8]` which would set
pins 4, 5 & 6 on the backpack to have strips of length 8 each on them.

(3) If using custom firmata then use an array of objects eg
`[ {pin: 4, length: 8}, {pin: 10, length: 8}, {pin: 11, length: 8} ]`
which would set pins 4, 10 & 11 to have strips of length 8 on each of them.

#### Events

* `onready()` -  emits when the `strip` is configured.
* `onerror()` - returns the error that occurred.

#### Examples

_Johnny-Five instantiation_

```
pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board(opts);
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        pin: 6,
        length: 4,
        board: this,
        controller: "FIRMATA",
    });

    strip.on("ready", function() {
        // do stuff with the strip here.
    });
});
```

_Firmata instantiation_

```
pixel = require("node-pixel");
var firmata = require('firmata');

var board = new firmata.Board('path to usb',function(){

    strip = new pixel.Strip({
        pin: 6,
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

```
pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board(opts);

board.on("ready", function() {
    strip = new pixel.Strip({
        length: 4,
        board: this,
        controller: "I2CBACKPACK",
    });

    strip.on("ready", function() {
        // do stuff with the strip here.

    });
});
```

Note that Johnny-Five uses the board option and firmata uses the firmata option.
This is because the pixel library supports and Board capable of presenting an
IO interface. The library will work out the right thing to do based on the
board being passed and the controller being set.

#### Methods

##### show();

The show method should be called at the point you want to "set" the frame on
the strip of pixels and show them.

###### Example

```
// ... make pixel modifications

strip.show(); // make the strip latch and update the LEDs
```

Addressable LEDs work by clocking data along their entire length and so
you make the various changes you want to the strip then call `show()`
to propagate this data through the LEDs.

##### color( *colourstring* );

All LEDs on the strip can be set to the same colour using the `.color()` method.

###### Parameters

* **colourstring** A `String` as a standard HTML hex colour or a CSS colour name,
or a CSS rgb(r, g, b) value used to specify the colour of the strip. Alternatively
an `Array` object as an rgb value eg `[r, g, b]`


###### Example

_Set strip using a hex value_

```
strip.color("#ff0000"); // turns entire strip red using a hex colour
strip.show();
```

_Update strip using a named CSS colour_

```
strip.color("teal"); // sets strip to a blue-green color using a named colour
strip.show();
```

_You can also use CSS RGB values_

```
strip.color("rgb(0, 255, 0)"); // sets strip to green using rgb values
strip.show();
```

_Or set using an array of RGB values_

```
strip.color([255, 255, 0]); // Sets strip using an array
strip.show();
```

##### pixel( *address* );

Individual pixels can be addressed by the pixel method using their address in
the sequence.

###### Parameter

* **address** A `Number` indexing the pixel you want. Returns a `Pixel` object.

###### Example

```
var p = strip.pixel(1); // get the second LED. p is now a Pixel object
```

### Pixel

A pixel is an individual element in the strip. It is fairly basic and it's API
is detailed below.

#### Methods

##### color( *color string* )

Colors work exactly the same way on individual pixels as per strips so see the
`strip.color` reference above.

###### Parameters

* **color string** A `String` providing the hex colour, CSS colour name or CSS
rgb() values to be used to set the individual pixel a certain colour. You can also
pass in an `Array` object that is a set of RGB values as [r, g, b].

###### Examples

```
var p = strip.pixel(1);     // get second LED
p.color("#0000FF");         // set second pixel blue.

p = strip.pixel(2);         // get third LED
p.color("orange");          // set third pixel red/yellow

p = strip.pixel(3);         // get fourth LED
p.color("rgb(0, 255, 0)");  // set fourth LED green

p = strip.pixel(4);         // get fifth LED
p.color([255, 0, 255]);     // set fifth LED magenta
```

##### color()

Returns an object representing the color of this pixel with the shape below.

###### Parameters

* none

###### Shape

```
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

```
var p = strip.pixel(1); // get second LED

p.color("#0000FF"); // set second pixel blue.

p.color(); // returns {r:0, g:0, b:255, hexcode:"#0000ff", color:"blue", rgb[0,0,255]}
```

## TODO and roadmap

This library is under active development and planned modifications are:

* Make the strand length configurable without changing firmware
* Remove the dependency on the Adafruit NeoPixel library and reduce complexity
* Provide methods of having different shapes to the strips

