# node-ws2812 library

This library is to provide an interface for interacting with WS2812 strand controllable RGB LEDs (also known as Neo Pixels if you shop at Adafruit). The core functions of the adafruit neopixel library have been wrapped on the arduino side and provided with a firmata interface, thus allowing control from firmata, johnny-five etc.

## Installation

To install you will need to ensure you have [Arduino](http://arduino.cc/en/Guide/HomePage) running with the [Neo Pixel library installed](http://learn.adafruit.com/adafruit-neopixel-uberguide/arduino-library). Before you get too carried away, spending 20 minutes familiarising yourself with the LEDs and some of their limitations is definitely worth it. The [Adafruit Uber Guide](http://learn.adafruit.com/adafruit-neopixel-uberguide/overview) has just about everything you need to know in it there.

I'm going to assume you have NodeJS all ready to go too.

Once all of that is done git clone the repo and install the dependencies:

```
git clone https://github.com/ajfisher/rgbled
cd rgbled
npm install
```

Finally - in order to build the software for your arduino you'll need to put the arduino/ws2812 folder in your libraries directory. For simplicity I usually use a link to the files rather than copying. On my system (Ubuntu) that looks like this:

```
ln -s /home/ajfisher/dev/rgbled/arduino/ws2812 /home/ajfisher/sketchbook/libraries/
```

More generically:

```
ln -s /path/to/git/repo/adruino/ws2812 /path/to/sketchbook/libraries/
```

Once that's done, restart the arduino IDE and the library will be available to you.

### Attach your LEDs

With the hardware off, attach your pixels to the arduino. Usually this involves getting a 5V source, a ground and then attaching the data line to an arduino digital pin. Right now the library only supports PIN 6 (but this will become configurable).

You can test if this is working properly by loading your arduino with the NeoPixel Strand Test sketch. If you're all working okay then it's time to load the custom firmata.

### Flash your arduino

A custom build of firmata is required to use the WS2812s so you'll need to put that on your arduino.

Open up arduino/ws2812_firmata/ws2812_firmata.ino in the arduino IDE and then compile it and upload it to the arduino. If all went well you'll now have custom firmata on there. If not, log an issue on github.

## Interacting via Node

Now the arduino side is set up it's time to interact via JavaScript. The best example to run first is the repl as you'll be able to control the pixels via an interactive prompt.

Commands are:

*rainbow(pixelcount):* creates a rainbow effect on the stand where _pixelcount_ is the number of LEDs in the strand in total.

*sendPixel(red, green, blue, position):* sends a colour to the nominated LED given by _position_ consisting of the _red_, _green_ and _blue_ values which are integers between 0 (fully off) and 255 (fully on) for each colour channel.

*sendPackedPixel(colour, position):* sends a colour to the nominated LED given by _position_ consisting of a 24 bit integer mapping to first 8 pixels being the red channel, second 8 as the green channel and third 8 the blue channel. This is most easily expressed using hex notation such as 0xFFCC99 (however note it's a hexadecimal number)

eg

```javascript
rainbow(50); //creates a rainbow effect over 50 pixels
sendPixel(255,255,0,0); // turns the first pixel yellow
sendPixel(255.255.0."a"); // turns all pixels yellow
sendPackedPixel(0x00FFFF, 1); // turns the second pixel cyan
sendPackedPixel(0x00FFFF, "a"); // turns all pixels cyan
```

## TODO and roadmap

This library is under active development and planned modifications are:

* Make the pin definition and strand length configurable from firmata
* Make a Johnny-Five library to abstract all of the low level control
* Create a method for animating the strands
* Enhance the protocol parser to be able to read multiple pixels in one message
* Update the LED values then send a message to "show" it all in one go rather than by pixel right now

## Acknowledgements

This library wouldn't exist without the great work done by Adafruit on their NeoPixel libraries. Make sure you go buy pixels from them and support great open hardware.