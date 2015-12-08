/**
 *
 * This the ws2812 library used for the various examples
 *
 * Most of its job is to parse messages correctly and hand off to the
 * Adafruit library for more serious tasking.
 *
 * You'll need to call ws2812_initialise() to begin with so it sets up
 * the strip appropriately
 *
 */

#ifndef WS2812_h
#define WS2812_h

#include "Arduino.h"
#include "lw_ws2812.h"

// define the firmata commands needed
#define PIXEL_COMMAND           0x51 // firmata command used for a pixel

// pixel command instruction set
#define PIXEL_OFF               0x00 // set strip to be off
#define PIXEL_CONFIG            0x01 // DEPRECATED was setting pin and length
#define PIXEL_SHOW              0x02 // latch the pixels and show them
#define PIXEL_SET_PIXEL         0x03 // set the color value of pixel n using 32bit packed color value
#define PIXEL_SET_STRIP         0x04 // set color of whole strip

// define the colour element layouts
#define PIXEL_COLOUR_GRB        0x0
#define PIXEL_COLOUR_RGB        0x1
#define PIXEL_COLOUR_BRG        0x2

#define STRIP_START_PIN 0

#define MAX_STRIPS 8
#define LED_DEFAULT_PIN 6
#define STRIP_LENGTH 64

#define BUFLENGTH 64

void ws2812_initialise();
void ws2812_initialise(bool backpack);
void process_command(byte argc, byte *argv);

#endif
