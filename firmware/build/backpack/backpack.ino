
#define I2C_SENSOR_ADDRESS  0x42
#define MAX_RECEIVED_BYTES  16

#include <Wire.h>
#include "./Adafruit_NeoPixel.h"
#include "./ws2812.h"


#define STRIP_LENGTH 17
#define LED_PIN 6

#include "includes.h"


void setup() {


    Wire.begin(I2C_SENSOR_ADDRESS);
    Wire.onReceive(receiveData);

#if _DEBUG
    Serial.begin(9600);
    Serial.println("NeoPixel I2C");
#endif

    ws2812_initialise();
}

void loop() {

    delay(1);
}

void receiveData(receiveint numbytes) {

    #if _DEBUG
        Serial.println("\nRD");
        Serial.print("NB: ");
        Serial.print(numbytes);
        Serial.println();
    #endif

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

}
