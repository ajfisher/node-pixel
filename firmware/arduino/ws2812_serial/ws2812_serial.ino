#include <Adafruit_NeoPixel.h>
#include "ws2812.h"

/**

TODO: 

1. Convert this to a basic firmata to be able to control it simply via
the same way you do with the FT ones.

2. From there make it configurable so the constructor is called off a construction
method so that it can be determined. Look at using a proper SYSEX message for this

3. From there include into the standard simplebot firmata to be able to use it
in there quite happily. 
**/


void setup() {
    Serial.begin(9600);
    ws2812_initialise();
}

void loop() {
    if (Serial.available() > 10) {
        SerialParse();
    }

    delay(1);

}

void SerialParse(void) {
    // processes the serial commands
    int bufCount; // counter for the string buffer.
    char buffer[BUFLENGTH]; // character buffer for the serial message

    bufCount = -1; // reset it
    bufCount = Serial.readBytesUntil('\n', buffer, BUFLENGTH);

    if (bufCount > 0) {

        String message = String(buffer);
        // now we have a message, let's parse it.
        int msg_index = message.lastIndexOf('{');
        if (msg_index >= 0) {
            parse_message(message, msg_index);
        }
    }
}

