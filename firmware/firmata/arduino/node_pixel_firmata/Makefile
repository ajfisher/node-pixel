ARDUINO_DIST=~/arduino-1.6.4/arduino
FIRMATA_FIRMWARE=node_pixel_firmata.ino
BOARD=arduino:avr:uno
PORT=/dev/ttyACM0

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


