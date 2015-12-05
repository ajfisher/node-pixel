#include "ws2812.h"
#include "Arduino.h"

bool isBackpack = false;

WS2812 strips[MAX_STRIPS];

uint8_t no_strips = 0; // how many strips have we configured.
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

}

void process_command(byte argc, byte *argv){
    // this takes a pixel command that has been determined and then
    // processes it appropriately.

    // get the strip value off the command first

    uint8_t command = 0xF & argv[0];

    // now process the command.
    switch (command) {
        case PIXEL_SHOW: {
            // FIXME update this to use strips and iterate over it.
            for (uint8_t i = 0; i< MAX_STRIPS; i++) {
                if (strips[i].get_length() > 0 && strip_changed[i]) {
                    strips[i].sync();
                }
                strip_changed[i] = false;
            }
            break;
        }
        case PIXEL_SET_STRIP: {
            // sets the entirety of the strip to one colour
            // FIXME this needs to operate over all the strips as well.
            uint32_t strip_colour = (uint32_t)argv[1] + ((uint32_t)argv[2]<<7) + ((uint32_t)argv[3]<<14) + ((uint32_t)argv[4] << 21);
            for (uint8_t i = 0; i < MAX_STRIPS; i++) {
                if (strips[i].get_length() > 0) {
                    // TODO put detection in for colour off and then do a memset on it.
                    for (uint16_t j = 0; j<strips[i].get_length(); j++) {
                        strips[i].set_rgb_at(j, strip_colour);
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
            //strips[1].set_rgb_at(index, colour);
            //strip_changed[1] = false;
            // FIXME this needs to figure out which strip to use and set it.
            break;
        }
        case PIXEL_CONFIG_FIRMATA: {
            // Sets the pin that the neopixel strip is on as well as it's length

            // check to ensure we have at least 3 arg bytes (1 for pin & 2 for len)
            if (argc >= 3) {
                // loop over each group of 3 bytes and pull out the details
                // around the pin and strand length.
                for (uint8_t i = 0; i < (argc / 3); i ++) {
                    // calc the argv offset as x3 for each group & +1 due to the
                    // PIXEL_CONFIG command at argv[0]
                    uint8_t argv_offset = i * 3;

                    uint8_t pin = (uint8_t)argv[argv_offset+1] & 0x1F;
                    strips[i].setOutput(pin);

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
        case PIXEL_CONFIG: {
            // Sets the pin and length of the specific strip
            Serial.print("ArgC: ");
            Serial.println(argc);
            break;

        }
        case PIXEL_CONFIG_BACKPACK: {
            // Sets the pin and length of the specific strip

            break;

        }
    }
}

