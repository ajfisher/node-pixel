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

// If you want to use the setColorOrder functions, enable this line
// TODO get this to work in setup
#define RGB_ORDER_ON_RUNTIME

#ifdef RGB_ORDER_ON_RUNTIME
	#define OFFSET_R(r) r+offsetRed
	#define OFFSET_G(g) g+offsetGreen
	#define OFFSET_B(b) b+offsetBlue
#else
// CHANGE YOUR STATIC RGB ORDER HERE
	#define OFFSET_R(r) r+1
	#define OFFSET_G(g) g
	#define OFFSET_B(b) b+2
#endif

class WS2812 {
public:
    WS2812(uint16_t num_led);
    WS2812();
	~WS2812();

	void setOutput(uint8_t pin);
    void set_length(uint16_t num_leds);

    uint8_t set_rgb_at(uint16_t index, uint32_t px_value);
    void set_off();
	void sync();

    uint16_t get_length();

#ifdef RGB_ORDER_ON_RUNTIME
	void setColorOrderRGB();
	void setColorOrderGRB();
	void setColorOrderBRG();
#endif

private:
	uint16_t count_led;
	uint8_t *pixels;

#ifdef RGB_ORDER_ON_RUNTIME
	uint8_t offsetRed;
	uint8_t offsetGreen;
	uint8_t offsetBlue;
#endif

    void init(uint16_t num_leds);
	void ws2812_sendarray_mask(uint8_t *array,uint16_t length, uint8_t pinmask,uint8_t *port, uint8_t *portreg);

	const volatile uint8_t *ws2812_port;
	volatile uint8_t *ws2812_port_reg;
	uint8_t pinMask;
};

#endif /* WS2812_H_ */
