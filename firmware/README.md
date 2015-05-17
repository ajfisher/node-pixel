# Firmware build instructions

Currently pixel is only supported using a direct firmata replacement. To 
use pixel you _will_ require a custom firmata installed on your arduino that has
the relevant additional libraries added into firmata.

Everything you need ships as part of this repo in the firmware/firmata directory. 

There are two methods of building.

## Using arduino IDE

If you just want to "go" and you have a pretty standard arduino (ie one that
plugs in via a USB cable) then this should work fine.

Open up the arduino IDE, navigate to the `firmware/firmata/arduino/node_pixel_firmata/`
folder and open up `node_pixel_firmata.ino`. This will bring in all the requirements.

Simply compile and upload to your arduino. Assuming no errors, you're good to go.

### Using Arduino CLI

You may also use the arduino CLI to compile and upload the firmware to an arduino
do this using the instructions given here: https://github.com/arduino/Arduino/blob/ide-1.5.x/build/shared/manpage.adoc


## Using the INO build tool

_Note_ This method is now considered deprecated in favour of using the arduino
IDE or CLI as it's now possible to automate this process. Also the board manager
makes this considerably easier to manage. This instruction will be left until
version 0.5.0 in order to migrate.

You will need to use ino tool to compile and upload this to the board so 
[follow the getting started directions](http://inotool.org/#installation) for
ino tool before attempting the next component.

To install firmata (and install all node dependencies also) follow the directions below.

```
cd ~
git clone https://github.com/ajfisher/node-pixel
cd node-pixel
npm install
cd firmware/firmata/ino/
ino clean && ino build -m uno
```

You should see the output of the build sequence and get a positive response from ino 
as below:

```
Searching for Board description file (boards.txt) ... /home/fishera/arduino-1.0.5/hardware/arduino/boards.txt
Searching for Arduino lib version file (version.txt) ... /home/fishera/arduino-1.0.5/lib/version.txt
Detecting Arduino software version ...  1.0.5 (1.0.5)
Searching for Arduino core library ... /home/fishera/arduino-1.0.5/hardware/arduino/cores/arduino
Searching for Arduino variants directory ... /home/fishera/arduino-1.0.5/hardware/arduino/variants
Searching for Arduino standard libraries ... /home/fishera/arduino-1.0.5/libraries
Searching for make ... /usr/bin/make
Searching for avr-gcc ... /usr/bin/avr-gcc
Searching for avr-g++ ... /usr/bin/avr-g++
Searching for avr-ar ... /usr/bin/avr-ar
Searching for avr-objcopy ... /usr/bin/avr-objcopy
src/node_pixel_firmata.ino
Searching for Arduino lib version file (version.txt) ... /home/fishera/arduino-1.0.5/lib/version.txt
Detecting Arduino software version ...  1.0.5 (1.0.5)
Scanning dependencies of src
Scanning dependencies of Servo
Scanning dependencies of neopixel
Scanning dependencies of ws2812
Scanning dependencies of Wire
Scanning dependencies of arduino
src/Firmata.cpp
src/node_pixel_firmata.cpp
Servo/Servo.cpp
Linking libServo.a
ws2812/ws2812.cpp
Linking libws2812.a
Wire/utility/twi.c
Wire/Wire.cpp
Linking libWire.a
neopixel/Adafruit_NeoPixel.cpp
Linking libneopixel.a
arduino/wiring_pulse.c
arduino/wiring_analog.c
arduino/WInterrupts.c
arduino/wiring_shift.c
arduino/avr-libc/malloc.c
arduino/avr-libc/realloc.c
arduino/wiring_digital.c
arduino/wiring.c
arduino/WString.cpp
arduino/new.cpp
arduino/Print.cpp
arduino/main.cpp
arduino/Stream.cpp
arduino/CDC.cpp
arduino/HID.cpp
arduino/USBCore.cpp
arduino/WMath.cpp
arduino/Tone.cpp
arduino/HardwareSerial.cpp
arduino/IPAddress.cpp
Linking libarduino.a
Linking firmware.elf
Converting to firmware.hex
```

Assuming no errors go ahead and upload using

    ino upload -m uno

You will get something similar to the following output:

```
Searching for stty ... /bin/stty
Searching for avrdude ... /home/pi/arduino-1.0.5/hardware/tools/avrdude
Searching for avrdude.conf ... /home/pi/arduino-1.0.5/hardware/tools/avrdude.conf
Guessing serial port ... /dev/ttyACM0

avrdude: AVR device initialized and ready to accept instructions

Reading | ################################################## | 100% 0.00s

avrdude: Device signature = 0x1e950f
avrdude: reading input file ".build/uno-620a679d/firmware.hex"
avrdude: writing flash (17628 bytes):

Writing | ################################################## | 100% 3.16s

avrdude: 17628 bytes of flash written
avrdude: verifying flash memory against .build/uno-620a679d/firmware.hex:
avrdude: load data flash data from input file .build/uno-620a679d/firmware.hex:
avrdude: input file .build/uno-620a679d/firmware.hex contains 17628 bytes
avrdude: reading on-chip flash data:

Reading | ################################################## | 100% 2.47s

avrdude: verifying ...
avrdude: 17628 bytes of flash verified

avrdude: safemode: Fuses OK

avrdude done.  Thank you.
```

If there's no errors then you now have the modified firmata on your ardunio and
you can now start using it.
