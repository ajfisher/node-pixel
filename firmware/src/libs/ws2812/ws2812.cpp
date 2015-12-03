#include "ws2812.h"
#include "Arduino.h"

bool isBackpack = false;

WS2812 strips[MAX_STRIPS];

uint8_t no_strips = 0; // how many strips have we configured.
uint16_t strip_lengths[MAX_STRIPS]; // now long each strip is.

void ws2812_initialise() {
    // initialises the strip defaults.

    for (uint8_t i = 0; i < MAX_STRIPS; i++) {
        strip_lengths[i] = 0;
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
            strips[0].sync();
            delay(100);
            strips[1].sync();
/**            for (uint8_t i = 0; i< MAX_STRIPS; i++) {
                if (strips[i].get_length() > 0) {
                    delay(100);
                    strips[i].sync();
                }
            }**/
            break;
        }
        case PIXEL_SET_STRIP: {
            // sets the entirety of the strip to one colour
            // FIXME this needs to operate over all the strips as well.
            uint32_t strip_colour = (uint32_t)argv[1] + ((uint32_t)argv[2]<<7) + ((uint32_t)argv[3]<<14) + ((uint32_t)argv[4] << 21);
            for (uint16_t j = 0; j<strip_lengths[0]; j++) {
                strips[0].set_rgb_at(j, strip_colour);
            }
            break;
        }
        case PIXEL_SET_PIXEL: {
            // sets the pixel given by the index to the given colour
            uint16_t index = (uint16_t)argv[1] + ((uint16_t)argv[2]<<7);
            uint32_t colour = (uint32_t)argv[3] + ((uint32_t)argv[4]<<7) + ((uint32_t)argv[5]<<14) + ((uint32_t)argv[6] << 21);
            strips[0].set_rgb_at(index, colour);
            strips[1].set_rgb_at(index, colour);
            // FIXME this needs to figure out which strip to use and set it.
            break;
        }
        case PIXEL_CONFIG: {
            // Sets the pin that the neopixel strip is on as well as it's length
            // TODO Make this multipin compatible.
            // Iterate over the list of strips that are set and then set it out.
            // get the bottom 5 bits off for the pin value

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
                    strip_lengths[i] = strips[i].get_length();
                }
            }

            break;
        }
        case PIXEL_CONFIG_FIRMATA: {
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

