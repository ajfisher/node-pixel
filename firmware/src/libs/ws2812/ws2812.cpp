#include "ws2812.h"
#include "Arduino.h"

bool isBackpack = false;
bool isShifting = false; // used when we're doing memory intensive shifting
bool writingFrame = false;
WS2812 strips[MAX_STRIPS];

uint16_t strip_lengths[MAX_STRIPS]; // now long each strip is.
bool strip_changed[MAX_STRIPS]; // used to optimise strip writes.

uint8_t *px;
uint16_t px_count;
uint8_t strip_count = 0; // number of strips being used.
uint8_t color_depth = 3; // Bytes used to hold one pixel

uint8_t offsetRed;
uint8_t offsetGreen;
uint8_t offsetBlue;

void ws2812_initialise() {
    // initialises the strip defaults.

    strip_count = 0;
    px_count = 0;
    for (uint8_t i = 0; i < MAX_STRIPS; i++) {
        strip_lengths[i] = 0;
        strip_changed[i] = false;
    }

#if DEBUG
    serialport.println("Initialising WS2812 library");
#endif
}

void ws2812_initialise(bool backpack) {
    // if backpack is true then set the strips up a little differently

    isBackpack = backpack;
    ws2812_initialise();
    if (isBackpack) {
        for (uint8_t i = 0; i< MAX_STRIPS; i++) {
            strips[i].setOutput(i+STRIP_START_PIN);
        };
    }
}

void initialise_pixels(uint16_t num_pixels) {
    // called to set up the pixel array, allocate memory etc.

    if (px) {
        free (px);
        px_count = 0;
    }

    if (num_pixels > 0) {
        if (px = (uint8_t *)malloc(num_pixels*color_depth)) {
            memset(px, 0, num_pixels*color_depth);
            px_count = num_pixels;
        } else {
            px_count = 0;
        }
    }

#if DEBUG
    serialport.print("Initialising ");
    serialport.print(strip_count);
    serialport.print(" strips ");
    serialport.print(px_count);
    serialport.println(" pixels");
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

        return 0;
    }
    return 1;
}

void shift_pixels(uint8_t amt, bool shift_forwards, bool wrap) {
    // take the pixel array and shift the items along the array
    // shift forwards determines direction of travel and wrap determines
    // if the values need to be wrapped around again.

    uint8_t *tmp_px;
    uint16_t slice_index;
    uint8_t copy_byte_length;
    if (amt > 0) {
        copy_byte_length = amt*color_depth;
    } else {
        return;
    }

    isShifting = true;

    if (wrap) {
        // need to allocate and then copy the memory from end of the array
        // into temporary array before we move it.
        if (tmp_px = (uint8_t *)malloc(copy_byte_length)) {
            memset(tmp_px, 0, copy_byte_length);
        }

        if (shift_forwards) {
            // grab from the end of the array;
            slice_index = (px_count - amt);
        } else {
            // grab from the start of the array;
            slice_index = 0;
        }
        memcpy(tmp_px, px+slice_index*color_depth, copy_byte_length);
    }
    // now memmove the data appropriately
    if (shift_forwards) {
        // memmove data down the array from 0 to length-amt
        memmove(px+copy_byte_length, px, (px_count - amt) * color_depth);
    } else {
        // memmove data up the array from amt to length to pos 0
        memmove(px, px+copy_byte_length, (px_count - amt) * color_depth);
    }

    if (wrap) {
        uint16_t copy_index = 0;
        if (! shift_forwards) {
            // get the position at the end to drop this in on.
            copy_index = px_count - amt;
        }

        memcpy(px+copy_index*color_depth, tmp_px, copy_byte_length);
        free(tmp_px);
    } else {
        // if we're not wrapping around then we'll need to fill the rest
        // with 0s
        uint16_t fill_index = 0;
        if (! shift_forwards) {
            // get position at the end to fill from
            fill_index = px_count - amt;
        }

        memset(px+fill_index*color_depth, 0, copy_byte_length);
    }

    isShifting = false;
}


void process_command(byte argc, byte *argv){
    // this takes a pixel command that has been determined and then
    // processes it appropriately.

    uint8_t command = 0xF & argv[0];

    // now process the command.
    switch (command) {
        case PIXEL_SHOW: {
            // iterate over the strips and show those required.

            if (! writingFrame && ! isShifting) {
                writingFrame = true;
                for (uint8_t i = 0; i < strip_count; i++) {
                    if (strip_changed[i]) {
                        strips[i].sync(px, color_depth);
                    }
                    strip_changed[i] = false;
                }
                writingFrame = false;
            }
            break;
        }
        case PIXEL_SET_STRIP: {
            // sets the entirety of the strip to one colour

            uint32_t strip_colour = (uint32_t)argv[1] +
                ((uint32_t)argv[2]<<7) +
                ((uint32_t)argv[3]<<14) +
                ((uint32_t)argv[4] << 21);

            if (! isShifting) {
                if (strip_colour == 0) {
                    // set all of the pixels back to 0
                    memset(px, 0, px_count * color_depth);
                } else {
                    for (uint16_t i = 0; i < px_count; i++) {
                        set_rgb_at(i, strip_colour);
                    }
                }
                // set all the strips dirty for update
                memset(strip_changed, true, strip_count);
            }
            break;
        }
        case PIXEL_SET_PIXEL: {
            // sets the pixel given by the index to the given colour
            uint16_t index = (uint16_t)argv[1] + ((uint16_t)argv[2]<<7);
            uint32_t colour = (uint32_t)argv[3] + ((uint32_t)argv[4]<<7) +
                ((uint32_t)argv[5]<<14) + ((uint32_t)argv[6] << 21);

            if (isShifting) {
                break;
            }

            set_rgb_at(index, colour);

            for (uint8_t i = 0; i < strip_count; i++) {
                // find the strip where this pixel is located and
                // then mark it dirty - but then bail out so you don't
                // overprocess.
                if (index < strip_lengths[i]) {
                    strip_changed[i] = true;
                    break;
                }
            }

            break;
        }
        case PIXEL_CONFIG: {
            // Sets the pin that the strip is on as well as it's length and color type

            if (argv[0] > 0x01) {
                // you get a weird boundary case in I2C where sometimes a message
                // is relayed from firmata without the command packet.
                // Just ignore this and move along
                break;
            }

            // check to ensure we have at least 3 arg bytes (1 for pin & 2 for len)
            if (argc >= 3) {
                // set everything back to initial state.
                ws2812_initialise(isBackpack);

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
                            setColorOrderGRB();
                            break;
                        case PIXEL_COLOUR_RGB:
                            setColorOrderRGB();
                            break;
                        case PIXEL_COLOUR_BRG:
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
                    strips[i].set_offset(prev_strip_length);
                    px_count = px_count + strips[i].get_length();

                    strip_count++;
                }
                // now initialise our pixel count
                initialise_pixels(px_count);
            }

            break;
        }// end config case
        case PIXEL_SHIFT: {

            // grab the number of pixels to shift by (bottom 5 bits)
            uint8_t shift_amt = argv[1] & 0x1F;
            // do we go forwards or backwards (bit 6)
            bool direction = (bool) (argv[1] & 0x20);
            // do we wrap around (bit 7)
            bool wrap = (bool) (argv[1] & 0x40);

            shift_pixels(shift_amt, direction, wrap);
            // set all the strips dirty.
            memset(strip_changed, true, strip_count);
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
    serialport.println(F("Pixel values"));
    for (uint8_t i=0; i < px_count; i++) {

        uint16_t index = i * color_depth;

        serialport.print(i);
        serialport.print(": ");
        serialport.print(px[OFFSET_R(index)]);
        serialport.print(" ");
        serialport.print(px[OFFSET_G(index)]);
        serialport.print(" ");
        serialport.print(px[OFFSET_B(index)]);
        serialport.println();
    }
}

int freeRam () {
  extern int __heap_start, *__brkval;
  int v;
  return (int) &v - (__brkval == 0 ? (int) &__heap_start : (int) __brkval);
}
#endif
