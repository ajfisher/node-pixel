.PHONY: clean test

# use this so we can call make again robustly if needed
THIS_FILE := $(lastword $(MAKEFILE_LIST))

FIRMWARE_DIR = ./firmware
BUILD_DIR = $(FIRMWARE_DIR)/build
BIN_DIR = $(FIRMWARE_DIR)/bin
SRC_DIR = $(FIRMWARE_DIR)/src
LIBS_DIR = $(SRC_DIR)/libs

help:
	@echo "Development actions:"
	@echo "--------------------"
	@echo "clean:            Cleans up everything"
	@echo "clean-node:       Cleans all of the node modules up"
	@echo "clean-build:      Cleans up all of the build folders"
	@echo "clean-compiled:   Cleans up all of the compiled files"
	@echo "install:          Installs all of the packages"
	@echo "lint:             Runs the linter"
	@echo "test:             Runs all of the tests"
	@echo ""
	@echo "Build actions:"
	@echo "--------------"
	@echo "build:            Builds all of the codebase"
	@echo "compile:          Compiles all of the binaries"
	@echo ""
	@echo "Release actions:"
	@echo "----------------"
	@echo "release:          Tags and releases code to NPM"
	@echo ""

clean: clean-node clean-build clean-compiled
	@echo "Run npm install to get started"

clean-node:
	# remove node files
	rm -rf node_modules/

clean-build-backpack:
	@# remove the firmware build items
	rm -rf $(BUILD_DIR)/backpack

clean-build-firmata:
	@# remove the firmware build items
	rm -rf $(BUILD_DIR)/node_pixel_firmata

clean-build: clean-build-backpack clean-build-firmata
	@# grunt clean
	@# remove the compiled bins
	rm -rf $(BIN_DIR)/firmata/*
	rm -rf $(BIN_DIR)/backpack/*

clean-compiled:
	# removes all of the compilation intermediate files
	for f in $(BIN_DIR)/*/*/*; \
	do \
    	if [[ $${f} != *.ino.hex ]]; \
		then \
			rm -rf $${f}; \
        fi; \
	done

install: clean
	@echo "Installing all of the packages needed"
	npm install

lint:
	@echo "Not implemented"

test:
	npm run test


# make the Firmata build process to copy the files to the right place
FIRMATA_DEST_DIR = $(BUILD_DIR)/node_pixel_firmata
FIRMATA_FILES = $(LIBS_DIR)/firmata/arduino/*.{h,cpp}

build-firmata: clean-build-firmata
	@echo "Creating firmata build files"
	mkdir $(FIRMATA_DEST_DIR)
	cp $(FIRMATA_FILES) $(FIRMATA_DEST_DIR)/
	cp $(LIBS_DIR)/ws2812/* $(FIRMATA_DEST_DIR)/
	cp $(LIBS_DIR)/lightws2812/* $(FIRMATA_DEST_DIR)/
	cp $(SRC_DIR)/controller_src/firmata/* $(FIRMATA_DEST_DIR)/
	@echo "Firmata build files ready"


# Make the backpack build process to copy the files to the right place
BACKPACK_DEST_DIR = $(BUILD_DIR)/backpack

build-backpack: clean-build-backpack
	@echo "Creating backpack build files"
	mkdir $(BACKPACK_DEST_DIR)
	cp $(LIBS_DIR)/ws2812/* $(BACKPACK_DEST_DIR)/
	cp $(LIBS_DIR)/lightws2812/* $(BACKPACK_DEST_DIR)/
	cp $(SRC_DIR)/controller_src/backpack/* $(BACKPACK_DEST_DIR)/
	@echo "Backpack build files ready"

build: build-backpack build-firmata
	@echo "run make compile to compile"


# Set out all of the targets and info to build the bins from
BOARD_TGTS = uno nano pro-mini mega diecimila leonardo micro
PKG_uno = "arduino:avr:uno"
PKG_nano = "arduino:avr:nano:cpu=atmega328"
PKG_pro-mini = "arduino:avr:pro:cpu=16MHzatmega328"
PKG_mega = "arduino:avr:mega:cpu=atmega2560"
PKG_diecimila = "arduino:avr:diecimila:cpu=atmega328"
PKG_leonardo = "arduino:avr:leonardo"
PKG_micro = "arduino:avr:micro"

FIRMATA_INO = $(FIRMATA_DEST_DIR)/node_pixel_firmata.ino
BACKPACK_INO = $(BACKPACK_DEST_DIR)/backpack.ino

compile: build-backpack build-firmata $(BOARD_TGTS)
	@# clean up all of the garbage files
	@$(MAKE) -f $(THIS_FILE) clean-compiled

$(BOARD_TGTS):
	@echo "This is $@ and package is $(PKG_$@) firmata $(FIRMATA_INO) BP $(BACKPACK_INO)"
	@# make the firmata bin for this target board
	$$ARDUINO_PATH --verify --verbose-build --board $(PKG_$@) \
		--pref build.path=$(BIN_DIR)/firmata/$@ $(FIRMATA_INO)

	@# make the firmata bin for this target board
	$$ARDUINO_PATH --verify --verbose-build --board $(PKG_$@) \
		--pref build.path=$(BIN_DIR)/backpack/$@ $(BACKPACK_INO)

release:
	@echo "Not implemented"


