#include "ws2812.h"
#include "Arduino.h"

Adafruit_NeoPixel strip = Adafruit_NeoPixel(STRIP_LENGTH, LED_PIN, NEO_GRB + NEO_KHZ800);

char buf[BUFLENGTH]; // character buffer for json message processing

void ws2812_initialise() {
    // initialises the strip
    strip.begin();
    strip.show();
}

void process_command(byte argc, byte *argv){
    // this takes a pixel command that has been determined and then
    // processes it appropriately.

    switch (argv[0]) {
        case PIXEL_SHOW: {
            show();
            break;
        }
        case PIXEL_SET_STRIP: {
            // sets the entirety of the strip to one colour
            uint32_t strip_colour = (uint32_t)argv[1] + ((uint32_t)argv[2]<<7) + ((uint32_t)argv[3]<<14) + ((uint32_t)argv[4] << 21);
            for (uint16_t i = 0; i<STRIP_LENGTH; i++) {
                strip.setPixelColor(i, strip_colour);
            }
            break;
        }
        case PIXEL_SET_PIXEL: {
            // sets the pixel given by the index to the given colour
            uint16_t index = (uint16_t)argv[1] + ((uint16_t)argv[2]<<7);
            uint32_t colour = (uint32_t)argv[3] + ((uint32_t)argv[4]<<7) + ((uint32_t)argv[5]<<14) + ((uint32_t)argv[6] << 21);
            strip.setPixelColor(index, colour);
            break;
        }
        case PIXEL_CONFIG: {
            // Sets the pin that the neopixel strip is on.
            strip.setPin((uint8_t)argv[1]);

            // TODO: Sort out the strand length stuff here.

            break;

        }
    }
}

void parse_message(String& message, int message_start) {
    // this is now a NOOP

}

void show() {
    // simply runs the frame
    strip.show();
}
