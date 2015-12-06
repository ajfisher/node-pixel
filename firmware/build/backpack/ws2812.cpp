#include "ws2812.h"
#include "Arduino.h"

bool isBackpack = false;
bool writingFrame = false;
WS2812 strips[MAX_STRIPS];

uint16_t strip_lengths[MAX_STRIPS]; // now long each strip is.
bool strip_changed[MAX_STRIPS]; // used to optimise strip writes.

void ws2812_initialise() {
    // initialises the strip defaults.

    for (uint8_t i = 0; i < MAX_STRIPS; i++) {
        strip_lengths[i] = 0;
        strip_changed[i] = false;
    }
}

void ws2812_initialise(bool backpack) {
    // if backpack is true then set the strips up a little differently

    isBackpack = backpack;
    ws2812_initialise();
    for (uint8_t i = 0; i< MAX_STRIPS; i++) {
        strips[i].setOutput(i+STRIP_START_PIN);
    };

}

void process_command(byte argc, byte *argv){
    // this takes a pixel command that has been determined and then
    // processes it appropriately.

    uint8_t command = 0xF & argv[0];

    // now process the command.
    switch (command) {
        case PIXEL_SHOW: {
            // iterate over the strips and show those required.
            if (! writingFrame) {
                writingFrame = true;
                for (uint8_t i = 0; i< MAX_STRIPS; i++) {
                    if (strips[i].get_length() > 0 && strip_changed[i]) {
                        strips[i].sync();
                    }
                    strip_changed[i] = false;
                }
                writingFrame = false;
            }
            break;
        }
        case PIXEL_SET_STRIP: {
            // sets the entirety of the strip to one colour
            uint32_t strip_colour = (uint32_t)argv[1] + ((uint32_t)argv[2]<<7) + ((uint32_t)argv[3]<<14) + ((uint32_t)argv[4] << 21);
            for (uint8_t i = 0; i < MAX_STRIPS; i++) {
                if (strips[i].get_length() > 0) {
                    // If this is a blank then call strip off which is a bit more efficient
                    if (strip_colour == 0) {
                        strips[i].set_off();
                    } else {
                        for (uint16_t j = 0; j<strips[i].get_length(); j++) {
                            strips[i].set_rgb_at(j, strip_colour);
                        }
                    }
                    strip_changed[i] = true;
                }
            }
            break;
        }
        case PIXEL_SET_PIXEL: {
            // sets the pixel given by the index to the given colour
            uint16_t index = (uint16_t)argv[1] + ((uint16_t)argv[2]<<7);
            uint32_t colour = (uint32_t)argv[3] + ((uint32_t)argv[4]<<7) + ((uint32_t)argv[5]<<14) + ((uint32_t)argv[6] << 21);

            int8_t strip = -1;

            for (uint8_t i = 0; i < MAX_STRIPS; i++) {
                /**if (strip_lengths[i] == 0) {
                    // we are outside of the number of pixels we have so break
                    break;
                }**/
                if (index < strip_lengths[i]) {
                    strip = i;
                    break;
                }
            }

            if (strip >= 0) {
                if (strip == 0) {
                    strips[strip].set_rgb_at(index, colour);
                } else {
                    // calculate the index value for the strip we're actually
                    // looking at relative to the overall strip details
                    strips[strip].set_rgb_at(index-strip_lengths[strip-1], colour);
                }
                strip_changed[strip] = true;
            }
            break;
        }
        case PIXEL_CONFIG: {
            // Sets the pin that the strip is on as well as it's length and color type

            // check to ensure we have at least 3 arg bytes (1 for pin & 2 for len)
            if (argc >= 3) {
                // loop over each group of 3 bytes and pull out the details
                // around the pin and strand length.
                for (uint8_t i = 0; i < (argc / 3); i ++) {
                    // calc the argv offset as x3 for each group & +1 due to the
                    // PIXEL_CONFIG command at argv[0]
                    uint8_t argv_offset = i * 3;

                    if (!isBackpack) {
                        // we can specify the pin, otherwise it's determined.
                        uint8_t pin = (uint8_t)argv[argv_offset+1] & 0x1F;
                        strips[i].setOutput(pin);
                    }

                    // get the top two bits for the colour order type.
                    uint8_t colour_type = (uint8_t)argv[argv_offset+1]>>5;
                    switch (colour_type) {
                        case PIXEL_COLOUR_GRB:
                            strips[i].setColorOrderGRB();
                            break;
                        case PIXEL_COLOUR_RGB:
                            strips[i].setColorOrderRGB();
                            break;
                        case PIXEL_COLOUR_BRG:
                            strips[i].setColorOrderBRG();
                            break;
                    }

                    // now get the strand length
                    strips[i].set_length((uint16_t)(argv[argv_offset+2]+(argv[argv_offset+3]<<7)));
                    uint16_t prev_strip_length = 0;
                    if (i > 0) {
                        prev_strip_length = strip_lengths[i-1];
                    }
                    strip_lengths[i] = strips[i].get_length() + prev_strip_length;
                }
            }

            break;
        }
    }
}


