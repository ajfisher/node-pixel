# node-pixel changelog

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

