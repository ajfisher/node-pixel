#include "ws2812.h"
#include "Arduino.h"

// TODO Fix this absolutely disgusting hack

Adafruit_NeoPixel strip_0 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);

#if SINGLE_STRIP

    Adafruit_NeoPixel strips[] = {strip_0};
    int8_t strip_pins[MAX_STRIPS];

#else

    Adafruit_NeoPixel strip_1 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);
    Adafruit_NeoPixel strip_2 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);
    Adafruit_NeoPixel strip_3 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);
    Adafruit_NeoPixel strip_4 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);
    Adafruit_NeoPixel strip_5 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);
    Adafruit_NeoPixel strip_6 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);
    Adafruit_NeoPixel strip_7 = Adafruit_NeoPixel(STRIP_LENGTH, LED_DEFAULT_PIN, NEO_GRB + NEO_KHZ800);

    Adafruit_NeoPixel strips[] = {strip_0, strip_1, strip_2, strip_3,strip_4, strip_5,strip_6, strip_7};
    int8_t strip_pins[MAX_STRIPS];
#endif


void ws2812_initialise() {
    // initialises the strips

    for (uint8_t i=0; i< MAX_STRIPS; i++) {  
        strip_pins[i] = -1;
        strips[i].begin();
        strips[i].show();
    }
}

void process_command(byte argc, byte *argv){
    // this takes a pixel command that has been determined and then
    // processes it appropriately.

    // get the strip value off the command first

    uint8_t strip = argv[0] >> 4;
    uint8_t command = 0xF & argv[0];

    // now process the command.
    switch (command) {
        case PIXEL_SHOW: {
            for (uint8_t i = 0; i< MAX_STRIPS; i++) {
                if (strip_pins[i] > 0) {
                    delay(10); // TODO: Fix this as it's basically a latching wait.
                    strips[strip].show();
                }
            }
            break;
        }
        case PIXEL_SET_STRIP: {
            // sets the entirety of the strip to one colour
            uint32_t strip_colour = (uint32_t)argv[1] + ((uint32_t)argv[2]<<7) + ((uint32_t)argv[3]<<14) + ((uint32_t)argv[4] << 21);
            for (uint16_t i = 0; i<STRIP_LENGTH; i++) {
                strips[strip].setPixelColor(i, strip_colour);
            }
            break;
        }
        case PIXEL_SET_PIXEL: {
            // sets the pixel given by the index to the given colour
            uint16_t index = (uint16_t)argv[1] + ((uint16_t)argv[2]<<7);
            uint32_t colour = (uint32_t)argv[3] + ((uint32_t)argv[4]<<7) + ((uint32_t)argv[5]<<14) + ((uint32_t)argv[6] << 21);
            strips[strip].setPixelColor(index, colour);
            break;
        }
        case PIXEL_CONFIG: {
            // Sets the pin that the neopixel strip is on.
            strips[strip].setPin((uint8_t)argv[1]);
            strip_pins[strip] = (int8_t)argv[1];

            // TODO: Sort out the strand length stuff.

            break;

        }
    }
}

