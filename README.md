# node-pixel

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ajfisher/node-pixel?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The purpose of this library is to provide a node js interface for addressable RGB LEDs.
Most commonly these are known as Neo Pixels (if you shop at Adafruit) however 
any WS2812b addressable LED should work with this. 

The current iteration supports two methods of set up:

* a custom version of firmata that provides an interface to talk to the "pixels". 
* an I2C "backpack" using an arduino pro mini or nano that provides the interface
and then uses standard firmata.

Both of these mechanisms presently rely on the [Adafruit NeoPixel library](https://github.com/adafruit/Adafruit_NeoPixel). 

The pixel library can be used with both Johnny-Five or stock Node Firmata and
can be used by any board that provides an IO interface with I2C support such as
a Raspberry PI.

Both fimwares are provided in this repo in the firmware directory.

## Installation

Both methods of installation are covered in detail in the [Installation Guide](docs/installation.md).

## Pixel API

The Pixel API is provided below. 

### Strip

A sequence of LEDs all joined together is called a `strip` and you need to tell
the strip which `pin` (`data`) it is on and how many LEDs are in the sequence. 
In addition you need to provide the strip with a controller to tell it to use 
the custom firmata or I2C backpack.

#### Parameters

* **options** An object of property parameters

Property    | Type      | Value / Description   | Default   | Required
------------|-----------|-----------------------|-----------|----------
data        | Number    | Digital Pin. Used to set which pin the signal line to the pixels is being used. | 6   | yes
length      | Number    | Number of pixels to be set in the strip. Note excess of 256 will mean a firmware change. | 128 | no
board       | IO Object | IO Board object to use with Johnny Five  | undefined | yes(1)
firmata     | Firmata board | Firmata board object to use with Firmata directly | undefined | yes(1)
cotnroller  | String    | I2CBACKPACK, FIRMATA  | FIRMATA   | no

(1) A board or firmata object is required but only one of these needs to be set.

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
        data: 6,
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
        data: 6,
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
or a CSS rgb(r, g, b) value used to specify the colour of the strip.

TODO: Refactor to use new version

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
rgb() values to be used to set the individual pixel a certain colour

###### Examples

```
var p = strip.pixel(1);     // get second LED
p.color("#0000FF");         // set second pixel blue.

p = strip.pixel(2);         // get third LED
p.color("orange");          // set third pixel red/yellow

p = strip.pixel(3);         // get fourth LED
p.color("rgb(0, 255, 0)");  // set fourth LED green
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

* Make the pin definition and strand length configurable without changing firmware
* Remove the dependency on the Adafruit NeoPixel library and reduce complexity
* Make ability to have multiple strips on different pins
* Provide methods of having different shapes to the strips
* Alias all color() methods and properties to be colour() as well.

