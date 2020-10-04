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

Due to the way this is all managed, the best way to work with this set up is
to use something like arduino CLI tools so you can edit and then use make to
build and compile the files.

If you don't have that sort of setup then the next easiest way is to switch your
arduino IDE in preferences to "use an external editor". Then open up the target
you want to build and edit the source file in a separate editor (eg Sublime Text,
Vim or whatever). Then when you compile, the file and any supporting files will
be loaded.

Export the path to your ARDUINO application:

`export ARDUINO_PATH=~/Downloads/Arduino.app/Contents/MacOS/Arduino`

To make sure it's available to make.

## Make

A `Makefile` is included that has pretty much everything you need in it.

`make build` will get all the files to the right location and then you can use
the arduino cli tools or the arduino IDE to compile and flash to the board.

`make compile` is used to build and compile all targets and will use the arduino
command like invocation.

A useful trick is if you just want to build one target use `make uno` or `make nano`
and this will build just the backpack and firmata for that target.


## Building for deployment

If there are any mods to the src files then run `make build` to make sure
everything is updated properly.


## TODO

* Get issue fixed with arduino cli in order to build hex files automatically for
all major boards.
* Use the skt500 programmer to be able to install hex files directly without arduino

