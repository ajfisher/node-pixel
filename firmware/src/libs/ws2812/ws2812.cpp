#include "ws2812.h"
#include "Arduino.h"

bool isBackpack = false;
bool writingFrame = false;
WS2812 strips[MAX_STRIPS];

uint16_t strip_lengths[MAX_STRIPS]; // now long each strip is.
bool strip_changed[MAX_STRIPS]; // used to optimise strip writes.

uint8_t *px;
uint16_t px_count;
uint8_t color_depth = 3; // Bytes used to hold one pixel

uint8_t offsetRed;
uint8_t offsetGreen;
uint8_t offsetBlue;

void ws2812_initialise() {
    // initialises the strip defaults.

    for (uint8_t i = 0; i < MAX_STRIPS; i++) {
        strip_lengths[i] = 0;
        strip_changed[i] = false;
    }

#if DEBUG
    Serial2.println("Initialising WS2812 library");
#endif
}

void ws2812_initialise(bool backpack) {
    // if backpack is true then set the strips up a little differently

    isBackpack = backpack;
    ws2812_initialise();
    for (uint8_t i = 0; i< MAX_STRIPS; i++) {
        strips[i].setOutput(i+STRIP_START_PIN);
    };

}

void initialise_pixels(uint16_t num_pixels) {
    // called to set up the pixel array, allocate memory etc.

    if (px) {
        free (px);
    }

    if (num_pixels > 0) {
        if (px = (uint8_t *)malloc(num_pixels*color_depth)) {
            memset(px, 0, num_pixels*color_depth);
        } else {
            px_count = 0;
        }
    }
#if DEBUG
    Serial2.print("Initialising ");
    Serial2.print(px_count);
    Serial2.println(" pixels");
#endif
}

uint8_t set_rgb_at(uint16_t index, uint32_t px_value) {
    // takes a packed 24 bit value and sets the pixel appropriately.
    if (index < px_count) {
        uint16_t tmp_pixel;
        tmp_pixel = index * color_depth;

        px[OFFSET_R(tmp_pixel)] = (uint8_t)(px_value >> 16);
        px[OFFSET_G(tmp_pixel)] = (uint8_t)(px_value >> 8);
        px[OFFSET_B(tmp_pixel)] = (uint8_t)px_value;

#if DEBUG
/**        Serial2.print("Set RGB: ");
        Serial2.print(index);
        Serial2.print(" ");
        Serial2.print(px[OFFSET_R(tmp_pixel)]);
        Serial2.print(" ");
        Serial2.print(px[OFFSET_G(tmp_pixel)]);
        Serial2.print(" ");
        Serial2.println(px[OFFSET_B(tmp_pixel)]);**/
#endif
        return 0;
    }
    return 1;
}

void process_command(byte argc, byte *argv){
    // this takes a pixel command that has been determined and then
    // processes it appropriately.

    Serial2.print("Reciving command ");
    uint8_t command = 0xF & argv[0];
    Serial2.println(command);


    // now process the command.
    switch (command) {
        case PIXEL_SHOW: {
            // iterate over the strips and show those required.

            print_pixels();
            if (! writingFrame) {
                writingFrame = true;
                for (uint8_t i = 0; i< MAX_STRIPS; i++) {
                    if (strips[i].get_length() > 0 && strip_changed[i]) {
                        strips[i].sync(px);
                    }
                    strip_changed[i] = false;
                }
                writingFrame = false;
            }
            break;
        }
        case PIXEL_SET_STRIP: {
            // sets the entirety of the strip to one colour
            Serial2.println("Setting strip");

            uint32_t strip_colour = (uint32_t)argv[1] +
                ((uint32_t)argv[2]<<7) +
                ((uint32_t)argv[3]<<14) +
                ((uint32_t)argv[4] << 21);

            if (strip_colour == 0) {
                // TODO: set this correctly
                memset(px, 0, px_count * color_depth);
            } else {
                for (uint16_t i = 0; i < px_count; i++) {
                    set_rgb_at(i, strip_colour);
                }
                // set all the strips dirty for update
                for (uint8_t j = 0; j < MAX_STRIPS; j++) {
                    if (strips[j].get_length() > 0) {
                        strip_changed[j] = true;
                    }
                }
            }

/**            for (uint8_t i = 0; i < MAX_STRIPS; i++) {
                if (strips[i].get_length() > 0) {
                    // If this is a blank then call strip off which is a bit more efficient
                    if (strip_colour == 0) {
                        strips[i].set_off();
                    } else {
                        for (uint16_t j = 0; j<strips[i].get_length(); j++) {
                            //strips[i].set_rgb_at(j, strip_colour);
                            set_rgb_at(j, strip_colour);
                        }
                    }
                    strip_changed[i] = true;
                }
            }**/
            break;
        }
        case PIXEL_SET_PIXEL: {
            // sets the pixel given by the index to the given colour
            uint16_t index = (uint16_t)argv[1] + ((uint16_t)argv[2]<<7);
            uint32_t colour = (uint32_t)argv[3] + ((uint32_t)argv[4]<<7) +
                ((uint32_t)argv[5]<<14) + ((uint32_t)argv[6] << 21);

            int8_t strip = -1;

            set_rgb_at(index, colour);

            // TODO redo how we do this detection and how we mark a strip
            // as being dirty and needing an update
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
                    //strips[strip].set_rgb_at(index, colour);
                    ;
                } else {
                    // calculate the index value for the strip we're actually
                    // looking at relative to the overall strip details
                    //strips[strip].set_rgb_at(index-strip_lengths[strip-1], colour);
                    ;
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
                    // TODO: Rip out the strip versions below
                    switch (colour_type) {
                        case PIXEL_COLOUR_GRB:
                            //strips[i].setColorOrderGRB();
                            setColorOrderGRB();
                            break;
                        case PIXEL_COLOUR_RGB:
                            //strips[i].setColorOrderRGB();
                            setColorOrderRGB();
                            break;
                        case PIXEL_COLOUR_BRG:
                            //strips[i].setColorOrderBRG();
                            setColorOrderBRG();
                            break;
                    }

                    // now get the strand length and set it
                    strips[i].set_length((uint16_t)(argv[argv_offset+2]+(argv[argv_offset+3]<<7)));
                    uint16_t prev_strip_length = 0;
                    if (i > 0) {
                        prev_strip_length = strip_lengths[i-1];
                    }
                    strip_lengths[i] = strips[i].get_length() + prev_strip_length;
                    // set the strip's offset so it knows where it is in the
                    // 1D pixel array
                    strips[i].set_offset(strip_lengths[i]);
                    px_count = px_count + strips[i].get_length();
                }
                // now initialise our pixel count
                initialise_pixels(px_count);
            }

            break;
        }
    }
}

void setColorOrderGRB() { // Default color order
	offsetGreen = 0;
	offsetRed = 1;
	offsetBlue = 2;
}

void setColorOrderRGB() {
	offsetRed = 0;
	offsetGreen = 1;
	offsetBlue = 2;
}

void setColorOrderBRG() {
	offsetBlue = 0;
	offsetRed = 1;
	offsetGreen = 2;
}

#if DEBUG
void print_pixels() {
    // prints out the array of pixel values
    Serial2.println(F("Pixel values"));
    for (uint8_t i=0; i < px_count; i++) {

        uint16_t index = i * color_depth;

        Serial2.print(i);
        Serial2.print(": ");
        Serial2.print(px[OFFSET_R(index)]);
        Serial2.print(" ");
        Serial2.print(px[OFFSET_G(index)]);
        Serial2.print(" ");
        Serial2.print(px[OFFSET_B(index)]);
        Serial2.println();
    }
}
#endif
