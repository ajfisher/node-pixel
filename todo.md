# Current tasks

**Version:** `0.4.1`

> Library for controlling addressable LEDs (such as NeoPixels) from firmata or Johnny Five.

* * *

## TODO

## firmware/src/README.md

-  **TODO** `(line 56)` 

## firmware/src/controller_src/firmata/node_pixel_firmata.ino

-  **TODO** `(line 29)` : use Program Control to load stored profiles from EEPROM
-  **TODO** `(line 301)` : put error msgs in EEPROM
-  **TODO** `(line 303)` : save status to EEPROM here, if changed
-  **TODO** `(line 367)` : save status to EEPROM here, if changed
-  **TODO** `(line 629)` : option to load config from EEPROM instead of default
-  **TODO** `(line 662)` : this can never execute, since no pins default to digital input

## firmware/src/libs/firmata/Firmata.cpp

-  **TODO** `(line 218)`  make sure it handles -1 properly
-  **TODO** `(line 330)`  add single pin digital messages to the protocol, this needs to
-  **TODO** `(line 339)` : the digital message should not be sent on the serial port every

## firmware/src/libs/firmata/Firmata.h

-  **TODO** `(line 94)`  make it a subclass of a generic Serial/Stream base class
-  **TODO** `(line 114)`  implement this

## firmware/src/libs/ws2812/ws2812.cpp

-  **TODO** `(line 4)`  Fix this absolutely disgusting hack
-  **TODO** `(line 52)` : Fix this as it's basically a latching wait.
-  **TODO** `(line 78)` : Sort out the strand length stuff.

## firmware/src/libs/ws2812/ws2812.h

-  **TODO** `(line 31)`  remove all of this and consolidate properly.

## lib/pixel.js

-  **TODO** `(line 3)` :


* * *

Last generated: Sat Aug 15 2015 22:35:56 by [grunt-todo](https://github.com/leny/grunt-todo).
