
#define I2C_SENSOR_ADDRESS  0x42
#define MAX_RECEIVED_BYTES  16

#define serialport Serial2

#include <Wire.h>
#include "./lw_ws2812.h"
#include "./ws2812.h"

#include "includes.h"

void setup() {


    Wire.begin(I2C_SENSOR_ADDRESS);
    Wire.onReceive(receiveData);

#if DEBUG
    serialport.begin(9600);
    serialport.println("NodePixel I2C");
#endif

    ws2812_initialise(true);
}

void loop() {

    delay(1);
}

void receiveData(receiveint numbytes) {

    #if DEBUG_I2C
        serialport.println("\nRD");
        serialport.print("NB: ");
        serialport.print(numbytes);
        serialport.println();
    #endif

    byte received_bytes[MAX_RECEIVED_BYTES];

    // read the data off the wire and then send it to get parsed.
    for (uint8_t i=0; i < numbytes; i++) {
        if (i < MAX_RECEIVED_BYTES) {
                received_bytes[i] = Wire.read();
                #if DEBUG_I2C
                    serialport.print(received_bytes[i], HEX);
                    serialport.print(" ");
                #endif
        } else {
                Wire.read();
        }
    }

    process_command(numbytes, received_bytes);
}
