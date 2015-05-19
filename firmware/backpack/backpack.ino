#include "includes.h"

#include "./Adafruit_NeoPixel.h"
#include "./ws2812.h"

#define I2C_SENSOR_ADDRESS  0x42
#define MAX_RECEIVED_BYTES  16

#if defined(__AVR_ATtiny85__) 

    // FOR NOW YOU WILL NEED TO COMMENT THESE THINGS IN OR OUT
//      TODO Write a make sed script that does this based on board type
//    #include <TinyWireS.h>
//    #include <avr/power.h>

//    #include <SendOnlySoftwareSerial.h>

    //SendOnlySoftwareSerial Serial(3);
    #define LED_PIN 4

#endif


// used to specify the backpack as being a full arduino
#if defined(ARDUINO_AVR_NANO) || defined (ARDUINO_AVR_UNO)

    #include <Wire.h>
    #define STRIP_LENGTH 17
    #define LED_PIN 6
    // set this to use it later.
    #define ATMEGA true

#endif


void setup() {

#if defined( __AVR_ATtiny85__ )
    // Set prescaler so CPU runs at 16MHz
    if (F_CPU == 16000000) clock_prescale_set(clock_div_1);

  
    // Use TinyWire for ATTINY
    TinyWireS.begin(I2C_SENSOR_ADDRESS);
    TinyWireS.onReceive(receiveData);
#endif

#if defined(ATMEGA)

    Wire.begin(I2C_SENSOR_ADDRESS);
    Wire.onReceive(receiveData);

#endif

#if _DEBUG
    Serial.begin(9600);
    Serial.println("NeoPixel I2C");
#endif

    ws2812_initialise();
}


void loop() {

#if defined( __AVR_ATtiny85__ )
    // USE this for ATTINY as you can't use delay
    TinyWireS_stop_check();
#else
    delay(20);
#endif
}

void receiveData(int numbytes) {

    byte received_bytes[MAX_RECEIVED_BYTES];

    // read the data off the wire and then send it to get parsed.
    for (uint8_t i=0; i < numbytes; i++) {
        if (i < MAX_RECEIVED_BYTES) {
            received_bytes[i] = Wire.read();
        } else {
            Wire.read();
        }
    }

    process_command(numbytes, received_bytes);

#if _DEBUG
    Serial.println("\nReceived Data");
    Serial.print("Num bytes: ");
    Serial.print(numbytes);
    Serial.println();
#endif
}
