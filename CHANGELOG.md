# node-pixel changelog

### 0.6.1

* Fixed some default I2C address issues - thanks @frxnz

## 0.6.0

* Added `strip.off()` functionality and tests - thanks again @noopkat

### 0.5.2

* Documentation fixes around syntax highlighting thanks to @noopkat

### 0.5.1

* Modified maximum firmata to 192 pixels after profiling and lack of memory issue

## 0.5

* Strip multipin! You can now use and define multiple strips on different pins
in the firmata and I2C backpack versions of node-pixel.
* Tests are starting to be laid in for any development. New features
require tests to be built out as well from now on.
* Removed the AdaFruit lib and switched to lightweight lib with a number of
modifications from https://github.com/cpldcpu/light_ws2812 (mostly removals
of things we don't need because the JS side will take care of it).
* Added protocol changes to set the colour order of the strip so that you can
use different types of pixels
* Added protocol changes to define multiple strips of varying legnths
* Interface to the virtual strip is singular and the C lib takes care of the mapping
to the actual pixel required.
* Added `set_off()` in order to rapidly and efficiently wipe an entire strip of
values back to zero in the firmware.
* Implemented error checking for too many strips and too many pixels that would 
exceed memory limits in the firmware.
* Updated new examples and updated examples documentation properly incuding the
updates to the master readme and installation guides. All examples have code in
them as well as proper wiring diagrams.
* Package dependencies updated to bring into line.
* New tests for pixel lengths, strip maximums, ensuring calculations are correct.

### 0.4.1

* Fixed bug in backpack firmware that meant it was doing full scale serial debugging
by default.

## 0.4

* Major refactor to deal with install and symlinking issues. Updates mean a Grunt
task which is used to build the destination trees properly so the firmware can be
compiled. This means better cross-platform support as well as no symlinking when
npm installed the package. More details here
[https://github.com/ajfisher/node-pixel/issues/34](https://github.com/ajfisher/node-pixel/issues/34)
* New documentation added and installation instruction fixed.
* Grunt file used to do all building operations from a source tree to produce the
relevant files in the right place for building
* renamed the examples to be more sensical.

### 0.3.3

* @pierceray contributed two examples porting "rainbow" behaviour with a static
rainbow effect and a dynamic moving one.

### 0.3.2

* Various documentation updates to clean up errors.
* npm installation fixes - thanks @frxnz

### 0.3.1

* Documentation updates and bug fixes around Baudrate on backpack for RPi installation
* Thanks to @frxnz


## 0.3.0

* Added pin selection to the constructor in order to be able to set which pin
you are using for the strip.
* Added custom I2C controller in pixel.js
* added custom I2C Backpack firmware.
* Removed ATTIny85 support due to bugginess.
* Updated all documentation including firmware install support etc.


### 0.2.3

* Restructure of the firmware folder ahead of providing backpack and native
firmata controllers.
* Updated all of the package versions.


### 0.2.2

* Migration of all protocol messages to use firmata SYSEX commands with custom
command set that will be viable when moving to I2C / SPI.
* Updates to Pixel lib to talk this protocol
* Optimisation of the SYSEX commands to ensure high bitrate (now at 150fps on test rig - up from 18)
* Removal of all the string processing code which drops hex file size from 20K to 11K
* documentation of protocol as it's being created.


### 0.2.1

* First implementation of Pixel library on JS side against firmata API
* big restructure of entire code base to work properly in ino and arduino

## 0.2.0

* Removal of 95% of all custom firmata messages and compression of existing
messages in order to speed things up.
* Entire restructure of code library including ino support and structure to
support no-dependency firmware compilation.

## 0.1.0

* Firmata only implementation
* Specific implementation in firmata to provide functions
* Naive implementation against Adafruit NP library.
* Initial build of library

