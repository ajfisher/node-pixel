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

#define DEBUG true

#include "Arduino.h"
#include "Adafruit_NeoPixel.h"

// define the firmata commands needed
#define PIXEL_COMMAND       0x51 // firmata command used for a pixel

// pixel command instruction set
#define PIXEL_OFF           0x00 // set strip to be off
#define PIXEL_CONFIG        0x01 // set pin number and max length
#define PIXEL_SHOW          0x02 // latch the pixels and show them
#define PIXEL_SET_PIXEL     0x03 // set the color value of pixel n using 32bit packed color value        
#define PIXEL_SET_STRIP     0x04 // set color of whole strip

#define LED_PIN 6
#define STRIP_LENGTH 256
#define BUFLENGTH 64

void ws2812_initialise();
void process_command(byte argc, byte *argv);
void parse_message(String& message, int message_start);
void show();

#endif
