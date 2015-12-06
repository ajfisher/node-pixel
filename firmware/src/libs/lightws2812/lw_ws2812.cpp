/*
* light weight WS2812 lib V2.1 - Arduino support
*
* Controls WS2811/WS2812/WS2812B RGB-LEDs
* Author: Matthias Riegler
*
* Mar 07 2014: Added Arduino and C++ Library
*
* September 6, 2014:	Added option to switch between most popular color orders
*						(RGB, GRB, and BRG) --  Windell H. Oskay
*
* License: GNU GPL v2 (see License.txt)
*/

#include "lw_ws2812.h"
#include <stdlib.h>

WS2812::WS2812(uint16_t num_leds) {
    // used when we know the lengths up front.
    init(num_leds);
}

WS2812::WS2812() {
    // used as an empty constructor for setup.
    init(0);
}

void WS2812::init(uint16_t num_leds) {

    set_length(num_leds);
	#ifdef RGB_ORDER_ON_RUNTIME
		offsetGreen = 0;
		offsetRed = 1;
		offsetBlue = 2;
	#endif
}

void WS2812::set_length(uint16_t num_leds) {
    // frees the memory appropriately based on what is sent through.
    //
    if (pixels) {
        free (pixels);
    }

    count_led = num_leds;
    if (count_led > 0) {
        if (pixels = (uint8_t *)malloc(count_led*3)) {
            memset(pixels, 0, count_led*3);
        } else {
            count_led = 0;
        }
    }
}

uint16_t WS2812::get_length() {
    return count_led;
}

void WS2812::set_off() {
    // turns the strip fully off.
    memset(pixels, 0, count_led*3);
}

uint8_t WS2812::set_rgb_at(uint16_t index, uint32_t px_value) {
    // takes a packed 24 bit value and sets the pixel appropriately.
    if (index < count_led) {
        uint16_t tmp_pixel;
        tmp_pixel = index * 3;

        pixels[OFFSET_R(tmp_pixel)] = (uint8_t)(px_value >> 16);
        pixels[OFFSET_G(tmp_pixel)] = (uint8_t)(px_value >> 8);
        pixels[OFFSET_B(tmp_pixel)] = (uint8_t)px_value;

        return 0;
    }
    return 1;

}

void WS2812::sync() {
	*ws2812_port_reg |= pinMask; // Enable DDR
	ws2812_sendarray_mask(pixels,3*count_led,pinMask,(uint8_t*) ws2812_port,(uint8_t*) ws2812_port_reg );
}

#ifdef RGB_ORDER_ON_RUNTIME
void WS2812::setColorOrderGRB() { // Default color order
	offsetGreen = 0;
	offsetRed = 1;
	offsetBlue = 2;
}

void WS2812::setColorOrderRGB() {
	offsetRed = 0;
	offsetGreen = 1;
	offsetBlue = 2;
}

void WS2812::setColorOrderBRG() {
	offsetBlue = 0;
	offsetRed = 1;
	offsetGreen = 2;
}
#endif

WS2812::~WS2812() {
}


#ifndef ARDUINO
void WS2812::setOutput(const volatile uint8_t* port, volatile uint8_t* reg, uint8_t pin) {
	pinMask = (1<<pin);
	ws2812_port = port;
	ws2812_port_reg = reg;
}
#else
void WS2812::setOutput(uint8_t pin) {
	pinMask = digitalPinToBitMask(pin);
	ws2812_port = portOutputRegister(digitalPinToPort(pin));
	ws2812_port_reg = portModeRegister(digitalPinToPort(pin));
}
#endif
