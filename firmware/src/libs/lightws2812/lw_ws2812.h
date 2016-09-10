/*
* light weight WS2812 lib V2.1 - Arduino support
*
* Controls WS2811/WS2812/WS2812B RGB-LEDs
* Author: Matthias Riegler
*
* Mar 07 2014: Added Arduino and C++ Library
*
* September 6, 2014      Added option to switch between most popular color orders
*                          (RGB, GRB, and BRG) --  Windell H. Oskay
*
* January 24, 2015       Added option to make color orders static again
*                        Moved cRGB to a header so it is easier to replace / expand
*                              (added SetHSV based on code from kasperkamperman.com)
*                                              -- Freezy
*
* License: GNU GPL v2 (see License.txt)
*/

#ifndef WS2812_H_
#define WS2812_H_

#include <avr/interrupt.h>
#include <avr/io.h>
#ifndef F_CPU
#define  F_CPU 16000000UL
#endif
#include <util/delay.h>
#include <stdint.h>

#include <Arduino.h>

class WS2812 {
public:
    WS2812(uint16_t num_led, uint16_t offset);
    WS2812(uint16_t num_led);
    WS2812();
	~WS2812();

	void setOutput(uint8_t pin);
    void set_length(uint16_t num_leds);
    void set_offset(uint16_t offset);

	void sync(uint8_t *px_array, uint8_t pixel_depth);

    uint16_t get_length();

private:
	uint16_t count_led; // how many LEDs being controlled
    uint16_t offset; // any offsets needing to be applied


    void init(uint16_t num_leds);
    void init(uint16_t num_leds, uint16_t offset);
	void ws2812_sendarray_mask(
            uint8_t *array, uint16_t length,
            uint8_t pinmask,uint8_t *port, uint8_t *portreg
    );

	const volatile uint8_t *ws2812_port;
	volatile uint8_t *ws2812_port_reg;
	uint8_t pinMask;
};

#endif /* WS2812_H_ */
