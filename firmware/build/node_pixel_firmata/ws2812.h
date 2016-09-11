/**
 *
 * This the ws2812 library used to manage the strip(s)
 *
 * Most of its job is to parse messages correctly and hand off to the
 * light library for more serious tasking.
 *
 * You'll need to call ws2812_initialise() to begin with so it sets up
 * the strip appropriately
 *
 */

#ifndef WS2812_h
#define WS2812_h

#define DEBUG false

#define serialport Serial2

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
#define PIXEL_SHIFT             0x05 // shift all pixels n places along the strip

// define the colour element layouts
#define PIXEL_COLOUR_GRB        0x0
#define PIXEL_COLOUR_RGB        0x1
#define PIXEL_COLOUR_BRG        0x2

#define STRIP_START_PIN 0

#define MAX_STRIPS 8
#define LED_DEFAULT_PIN 6
#define STRIP_LENGTH 64

#define BUFLENGTH 64

#define OFFSET_R(r) r+offsetRed
#define OFFSET_G(g) g+offsetGreen
#define OFFSET_B(b) b+offsetBlue

void ws2812_initialise();
void ws2812_initialise(bool backpack);
void process_command(byte argc, byte *argv);
void initialise_pixels(uint16_t num_pixels);
uint8_t set_rgb_at(uint16_t index, uint32_t px_value);

void setColorOrderRGB();
void setColorOrderGRB();
void setColorOrderBRG();

#if DEBUG
void print_pixels();
int freeRam();
#endif


#endif
