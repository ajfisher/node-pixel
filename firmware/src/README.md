# Firmware development guide

In order to manage dependencies with minimal duplication and to build firmware
for specific targets a build process is used. You will need to make sure you
have npm installed the development dependencies for this to work.

## SRC structure

```
|-- src
  |-- controller_src
    |-- node_pixel_firmata
    |-- backpack
  |-- libs
    |-- firmata
    |-- neopixel
    |-- ws2812
```

The `controller_src` directory contains target firmwares that need to be made. 
These are all in one location for convenience. The `libs` directory comtains 
the common library dependencies for the firmware. These are pulled into the 
relevant locations during the build process.

## Dev environment set up

This is all built using the `arduino-cli` command line tools.

Firstly - install the arduino-cli
[according to the directions here](https://arduino.github.io/arduino-cli/latest/installation/)
on the arduino CLI site.

You should also view the [getting started guide](https://arduino.github.io/arduino-cli/latest/getting-started/)
because you will need to ensure that you have all of the cores etc all set up
for use in your default configuration. 

The main cores you will need are:

* arduino:avr

You may also need to install some core libs as well. You can do this with the
`arduino-cli lib install` command. Some that may not be included by default are
listed below (note capitalisation):

* Servo

## Make

A `Makefile` is included that has pretty much everything you need in it.

`make build` will get all the files to the right location and then you can use
the arduino cli tools or the arduino IDE to compile and flash to the board.

`make compile` is used to build and compile all targets and will use the arduino
command like invocation.

A useful trick is if you just want to build one target use `make uno` or `make nano`
and this will build just the backpack and firmata for that target.

## Uploading a file for testing

The easiest way to do this is to build and upload using the arduino IDE. If you
don't want to do that and want to test the actual build process to make sure
the hex file you're outputting makes sense then you can do it using avrgirl

eg:

```
npx avrgirl-arduino flash -f firmware/bin/firmata/uno/node_pixel_firmata.ino.hex -a uno
```

Will flash the output firmata hexfile for uno to the board.

## Building for deployment

If there are any mods to the src files then run `make build` to make sure
everything is updated properly.


## TODO

* Get issue fixed with arduino cli in order to build hex files automatically for
all major boards.
* Use the skt500 programmer to be able to install hex files directly without arduino

