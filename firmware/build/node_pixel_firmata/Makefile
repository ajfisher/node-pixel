ARDUINO_DIST=~/Downloads/NArduino.app/Contents/MacOS/Arduino

#include ../../../config.mk

FIRMATA_FIRMWARE=node_pixel_firmata.ino
BOARD=arduino:avr:uno
PORT=/dev/tty.wchusbserial1410

build:

	echo $(ARDUINO_DIST)

ifneq ($(board), "") 
	BOARD=$(board)
endif

	$(ARDUINO_DIST) $(FIRMATA_FIRMWARE) --board $(BOARD) --verbose --verify


upload:

ifneq ($(board), "") 
	BOARD=$(board)
endif

	$(ARDUINO_DIST) $(FIRMATA_FIRMWARE) --board $(BOARD) --port $(PORT) --verbose --upload


