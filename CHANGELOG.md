# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.11.0](https://github.com/ajfisher/node-pixel/compare/v0.10.5...v0.11.0) (2020-10-25)


### Features

* **build:** Updated build process to use arduino-cli ([#175](https://github.com/ajfisher/node-pixel/issues/175)) ([effa990](https://github.com/ajfisher/node-pixel/commit/effa99034d6770419788eade327027d892dcd4dc))


### Build System

* **deps:** bump color-string from 1.5.3 to 1.5.4 ([3588aff](https://github.com/ajfisher/node-pixel/commit/3588affdc0679f1d927f44835fbe191c02d1b190))
* **deps-dev:** bump eslint from 7.10.0 to 7.11.0 ([1fd6af1](https://github.com/ajfisher/node-pixel/commit/1fd6af1283d131fcf988e2ffe41f91e7b31fa449))
* **deps-dev:** bump sinon from 9.1.0 to 9.2.0 ([#179](https://github.com/ajfisher/node-pixel/issues/179)) ([a9ea21f](https://github.com/ajfisher/node-pixel/commit/a9ea21f67988663e976fec931b3ee55e0ad5b0d5))
* Added github action for testing board compilation ([#176](https://github.com/ajfisher/node-pixel/issues/176)) ([5847799](https://github.com/ajfisher/node-pixel/commit/58477999099124921c50cfeedef9983e75ed1386))
* Move testing and coveralls to github actions ([#178](https://github.com/ajfisher/node-pixel/issues/178)) ([a49db6f](https://github.com/ajfisher/node-pixel/commit/a49db6faed2b59058a6be932c9c982b0f361b9c3)), closes [#177](https://github.com/ajfisher/node-pixel/issues/177)


### Documentation

* Updated readme to provide extra help for windows users. Fixes [#182](https://github.com/ajfisher/node-pixel/issues/182) ([#183](https://github.com/ajfisher/node-pixel/issues/183)) ([5e22e8a](https://github.com/ajfisher/node-pixel/commit/5e22e8af125582964c86cf7a8c1d8d9a377e03a7))


### Chores

* bump eslint from 7.11.0 to 7.12.0 ([#185](https://github.com/ajfisher/node-pixel/issues/185)) ([2dda10f](https://github.com/ajfisher/node-pixel/commit/2dda10f582ad2644dbe1906bb777e69b8c48bbc0))
* Create Dependabot config file ([#184](https://github.com/ajfisher/node-pixel/issues/184)) ([e390803](https://github.com/ajfisher/node-pixel/commit/e3908039898f48ae13fb53176116e2059b78fa82))

### [0.10.5](https://github.com/ajfisher/node-pixel/compare/v0.10.4...v0.10.5) (2020-10-05)


### Bug Fixes

* **linting:** Added linting checks to the JS files to the repo ([#169](https://github.com/ajfisher/node-pixel/issues/169)) ([f32c302](https://github.com/ajfisher/node-pixel/commit/f32c302517bb0581585dcf9f9b733462905d0fda))
* **utils:** Removed debug msg and added release recipe ([#172](https://github.com/ajfisher/node-pixel/issues/172)) ([710f29d](https://github.com/ajfisher/node-pixel/commit/710f29dea671ad24a5e4d28c71f1c84a2777f9e9))


### Chores

* **ci:** Add husky to repo with tests hooked correctly ([#170](https://github.com/ajfisher/node-pixel/issues/170)) ([e5e1a0e](https://github.com/ajfisher/node-pixel/commit/e5e1a0e500c9b878a07d456a194ce179ec2ce140))
* **ci:** Updated node versions to 12 and 14 for current support for travis ([#171](https://github.com/ajfisher/node-pixel/issues/171)) ([01f120e](https://github.com/ajfisher/node-pixel/commit/01f120ed665246a3af0d2f301cdf74d607c98ca4))


### Build System

* Additional make recipes to make life a bit easier ([#174](https://github.com/ajfisher/node-pixel/issues/174)) ([690d972](https://github.com/ajfisher/node-pixel/commit/690d9724341e999817642fc421228182bc404575))
* **docs:** Added changelog controls to standard-version to include other detail ([#173](https://github.com/ajfisher/node-pixel/issues/173)) ([0444aaa](https://github.com/ajfisher/node-pixel/commit/0444aaa1bc1d355907e1bb1d0bb7905a0bd57bb6))

### [0.10.4](https://github.com/ajfisher/node-pixel/compare/v0.10.3...v0.10.4) (2020-10-04)


### Bug Fixes

* **security:** Bump websocket-extensions from 0.1.3 to 0.1.4 ([#166](https://github.com/ajfisher/node-pixel/issues/166)) ([be57708](https://github.com/ajfisher/node-pixel/commit/be57708af67223001cbcc2cb997b1049a186b2f2))

### [0.10.3](https://github.com/ajfisher/node-pixel/compare/v0.10.2...v0.10.3) (2020-10-04)

### [0.10.2](https://github.com/ajfisher/node-pixel/compare/v0.10.0...v0.10.2) (2019-06-05)


### Bug Fixes

* **package:** update johnny-five to version 1.0.0 ([a43c8dc](https://github.com/ajfisher/node-pixel/commit/a43c8dc))



## 0.10.1

* Security updates to fix dependency security issues

## 0.10.0

* Updates for all major packages in the repo in order to bring back in line
* Build now passing for nodejs v10 and this has been added to build testing script
* Updates for johnny five and firmata and move firmata to peer dependency

### 0.9.3

* Breaking change with Sinon as a result of 3.0, needed to reactor tests as a
result
* Range of other package updates bringing back into line.

### 0.9.2

* Range of general changes related to upstream package dependencies and bringing
back into line.

### 0.9.1

* Example documentation updates to bring in line with the new `.length` API -
thanks @rupl
* Upgraded mockfirmata for testing

### 0.9.0

* Added capability for gamma correction for the strip. Currently set to no
correction by default, it can now be added as an initialisation parameter `gamma`.
* Package updates for all dependencies
* Bug fixes:
    * Made `pixel.off()` behaviour actually work properly as a result of test
    coverage - YAY Tests!
    * Better handling for the way exceptions are raised for range errors.
* Major update to tests
    * Roll out of istanbul for code coverage testing
    * Updates of tests to all work again properly with latest API due to drift
    * Addition of new test for gamma value creation
    * New test for ensuring `stripLength` throws an error
    * Removed redundant tests that were testing ColorString.
    * Fixes to test messages to better indicate what they were testing.
    * Large refactor to tests for exception handling
    * Added test for pixel.off correctness.
    * Tests for handling garbage colour values
    * Added tests for handling wrapping / shifting conditions.
    * Removed redundant checks in codebase where preconditions had to be met
    so checks were irrelevant
    * Added tests for handling issues where strips are incorrectly initialised
    * Achieved significant coverage improvement using Istanbul
* Added travis integration and integrated with gitter and coveralls.
* Added green keeper integration


### 0.8.3

* Fixes to all examples to bring in line with new `length` API and removal
of deprecration notices as a result of this change. Thanks @The-Alchemist

### 0.8.2

* Fixes to testing setup - thanks @reconbot

### 0.8.1

* Put in error check to make sure the firmata firmware is capable of doing
node-pixel stuff. Fixes [#74](https://github.com/ajfisher/node-pixel/issues/74)
* Put in I2C write check to deal with specifically time outs on high bandwidth
writes that appear to happen on RPi. Fixes [#71](https://github.com/ajfisher/node-pixel/issues/71)
and
* Added `.off()` option to individual pixels. Completed: [#61](https://github.com/ajfisher/node-pixel/issues/61)

### 0.8.0

* Moved all strip manipulation up to the level of the ws2812 library
in order to consolidate into a single array. This means that the `Strips` are now
relatively dumb and just operate on the array they are passed which is ripe
for further consolidation down the line. ( = more memory for pixels - YAY!)
* Added a SHIFT operation to the protocol per [#32](https://github.com/ajfisher/node-pixel/issues/32)
which is what required this large refactor above.
* Begun deprecation of `strip.stripLength()` and move to `strip.length` as the
more logic alternative. 0.8 generates warning, 0.9 will throw error, 0.10 will
have function removed
* Added example `examples/repl` that exposes `strip` object so you can manipulate
it from a repl environment

### 0.7.1

Thanks to @stevemao for the following:

* Updated strip color to consistently take arrays for the rgb model
* Made `Strip.off()` behaviour intuitive so it latches as soon as it's set
and turns the strip off.
* Updated package file to be able to run `npm test`

## 0.7.0

* updated packages to bring dependency list up to scratch.
* removed es6-collections shim YAY ES6.
* Updated node-pixel-firmata with latest version of StandardFirmata (v2.5.3)
* Updated lib to use new color string api.
* Resolved issue with an osx segfault when trying to write too quickly after
firmware returns
* Update to grunt file to now build and compile hexes to target MCU architecture
* Manifest file for interchange to be able to install to targets.
* Update of examples as needed.

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
