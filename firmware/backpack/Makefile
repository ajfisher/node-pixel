ARDUINO_DIST=~/arduino-1.6.4/arduino
FIRMATA_FIRMWARE=backpack.ino
BOARD=arduino:avr:nano:cpu=atmega328
#BOARD=adafruit:avr:trinket5
PORT=/dev/ttyUSB0

build:

ifneq ($(board), "") 
	BOARD=$(board)
endif

	$(ARDUINO_DIST) $(FIRMATA_FIRMWARE) --board $(BOARD) --verbose --verify


upload:

ifneq ($(board), "") 
	BOARD=$(board)
endif

	$(ARDUINO_DIST) $(FIRMATA_FIRMWARE) --board $(BOARD) --port $(PORT) --verbose --upload

