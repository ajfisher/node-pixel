# node-pixel

_important_ This library is currently in flux. Do not use this version. This will
be fixed in a day or so. In the mean time do this:

```
git clone https://github.com/ajfisher/node-pixel.git
git --reset HARD e6121a9473fbd8a07eb0b81179df5e6975050cca
```

This will put you at the last good commit state before all the work started.


The purpose of this library is to provide a node js interface for addressable RGB LEDs.
Most commonly these are known as Neo Pixels (if you shop at Adafruit) however 
other devices will also be supported as well.

As of this current iteration the implementation requires a specific version of
firmata to be used in order to provide an interface to talk to the "pixels". This
is done using the [Adafruit NeoPixel library](https://github.com/adafruit/Adafruit_NeoPixel). 

The pixel library can be used with both Johnny-Five or stock Node Firmata.

The firmware to run on your arduino is included in this repo in the firmware
folder and has a dedicated readme attached to that to describe the installation
process.

## Installation

It is assumed you have an [Arduino](http://arduino.cc/en/Guide/HomePage) and the IDE installed.

For the purposes of this I will assume you're using Adafruit NeoPixels and I'm going
to assume you've read the [NeoPixel Uber Guide](http://learn.adafruit.com/adafruit-neopixel-uberguide/overview)
as it has just about everything you need to know in it.

I'm going to assume you have NodeJS all ready to go too.

### Firmware installation.

Until the backpacks are sorted you'll need a special version of Firmata to make
your NeoPixels work. There are two ways to set this up. 

#### Option 1: Clone repo

Simply clone the repo and everything is here for you.

```
git clone https://github.com/ajfisher/node-pixel
cd node-pixel
npm install
```

#### Option 2: NPM

This will put everything in the node_modules folder and will include the firmware
so you just need to know where to look to find it.

```
npm install node-pixel
```

Now you have the files, go look at the (firmware installation guide)[https://github.com/ajfisher/node-pixel/tree/master/firmware]
as setting up the firmware is a bit detailed and this will also comprise the
instructions for updating the I2C backpack firmware too.

### Attach your LEDs

With the hardware off, attach your pixels to the arduino. Usually this involves 
getting a 5V source, a ground and then attaching the data line to an arduino 
digital pin. Right now the library only supports PIN 6 (but this will become configurable).

## Use the library

Now you're set up, it's time to use some JS to manipulate the LEDs.

To use the library, require it per normal:

```
var pixel = require("pixel");
```


## Pixel API

Now you have a strip of LEDs you want to do something with them. 

### Strip

A sequence of LEDs all joined together is called a `strip` and you need to tell
the strip which `pin` it is on and how many LEDs are in the sequence. In addition
you need to provide the strip with a firmata or Johnny-five instance.

_Johnny-Five instantiation_

```
pixel = require("pixel");
five = require("johnny-five");

var board = new five.Board(opts);
var strip = null;

board.on("ready", function() {

    strip = new pixel.Strip({
        data: 6,
        length: 4,
        board: this
    });

    // do stuff with the strip here.
});
```

_Firmata instantiation_

```
pixel = require("pixel");
var firmata = require('firmata');

var board = new firmata.Board('path to usb',function(){
    
    strip = new pixel.Strip({
        data: 6,
        length: 4,
        firmata: this.firmata
    });
});  
```

Note that Johnny-Five uses the board option and firmata uses the firmata option.
This is because the pixel library will support any Johnny-Five capable board
in the future using the backpacks.

#### show();

This should be applied at the point you want to "set" the frame on the pixels.

eg:

```
// make pixel modifications
strip.show(); // send the frame for the strip
```

Sequenced LEDs typically work by clocking data along their entire length and so
you usually make the various changes you want to make to the strip then call show
to propagate this data through the LEDs.

#### color("hexvalue");

All LEDs on the strip can be set using the .color() method. The color method will
take a standard HTML hex value to designate the color. eg:

```
strip.color("#ff0000"); // turns entire strip red
strip.show();
```

#### color("color name");

You can use HTML CSS color names and RGB values will be created from them. eg:

```
strip.color("teal"); // sets strip to a blue-green color.
strip.show();
```

#### color("rgb(r, g, b)");

RGB values are also valid if you prefer to use them, eg:

```
strip.color("rgb(0, 255, 0)"); // sets strip to green.
strip.show();
```

#### pixel(address);

Individual pixels can be addressed by the pixel method using their address in
the sequence. eg:

```
var p = strip.pixel(1); // get second LED
```





// and colors work just the same way on individual pixels too.
p.color("#0000FF"); // set second pixel blue.

// calling color() by itself will return an object with the current color
p.color(); // returns {r:0, g:0, b:255, hexcode:"#0000ff", color:"blue"}
```

## TODO and roadmap

This library is under active development and planned modifications are:

* Make the pin definition and strand length configurable without changing firmware
* Remove the dependency on the Adafruit NeoPixel library and reduce complexity
* Create an I2C "backpack" that will allow NeoPixels and others to work seamlessly
over standard I2C (how it should have been done to begin with) and remove 
the firmata modification requirement.
* Work with SPI (using the same principle as above).


