#include <Firmata.h>

#if MAX_DATA_BYTES < 64
#error "Firmata.h: MAX_DATA_BYTES should be increased to 64"
#endif


/**

TODO: 

2. From there make it configurable so the constructor is called off a construction
method so that it can be determined. Look at using a proper SYSEX message for this

**/
#include <Adafruit_NeoPixel.h>
#include "ws2812.h"


void setup() {
    firmataInitialize();
    ws2812_initialise();
}

void loop() {

    if (Firmata.available()) {
        Firmata.processInput();
    }

    delay(1);
}

#define QUERY_FIRMWARE  0x79

void firmataInitialize(void) {
    Firmata.setFirmwareNameAndVersion("NeoPixel", 2, 3);

    Firmata.attach(STRING_DATA, firmataStringCallback);
    Firmata.attach(START_SYSEX, firmataSysexCallback);

    Firmata.begin(57600);
    Firmata.printFirmwareVersion();
}

void firmataStringCallback(char *string) {

    String message = String(string);

    // now we have a message, let's parse it.
    int msg_index = message.lastIndexOf('{');
    if (msg_index >= 0) {
        parse_message(message, msg_index);
    }
    // Firmata bug: SysEx STRING_DATA handler uses malloc(), but not free()
    // https://github.com/firmata/arduino/issues/74

    free(string);
    string = 0;
}

void firmataSysexCallback(byte  command, byte  argc, byte *argv) {

    switch(command) {
        case ANALOG_MAPPING_QUERY:
            Serial.write(START_SYSEX);
            Serial.write(ANALOG_MAPPING_RESPONSE);
            Serial.write(END_SYSEX);
            break;

        case CAPABILITY_QUERY:
            Serial.write(START_SYSEX);
            Serial.write(CAPABILITY_RESPONSE);
            Serial.write(END_SYSEX);
            break;

        case QUERY_FIRMWARE:
            Firmata.printFirmwareVersion();
            break;
    }
}


