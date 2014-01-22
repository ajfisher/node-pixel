#include <Firmata.h>

#if MAX_DATA_BYTES < 64
#error "Firmata.h: MAX_DATA_BYTES should be increased to 64"
#endif

#include <Adafruit_NeoPixel.h>
#define LED_PIN 6
#define STRIP_LENGTH 44


/**

TODO: 

2. From there make it configurable so the constructor is called off a construction
method so that it can be determined. Look at using a proper SYSEX message for this

3. From there include into the standard simplebot firmata to be able to use it
in there quite happily. 
**/

#define BUFLENGTH 32
char buf[BUFLENGTH]; // character buffer for json message processing
int bufCount; // counter for the string buffer.

//Adafruit_NeoPixel *strip;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(STRIP_LENGTH, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
    firmataInitialize();
    //Serial.begin(9600);
    //Adafruit_NeoPixel strip2= Adafruit_NeoPixel(STRIP_LENGTH, LED_PIN, NEO_GRB + NEO_KHZ800);
    //strip = strip2;
    strip.begin();
    strip.show();
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


void SerialParse(void) {
    // processes the serial commands

    bufCount = -1; // reset it
    bufCount = Serial.readBytesUntil('\n', buf, BUFLENGTH);

    if (bufCount > 0) {

        String message = String(buf);
        // now we have a message, let's parse it.
        int msg_index = message.lastIndexOf('{');
        if (msg_index >= 0) {
            parse_message(message, msg_index);
        }
    }
}


void parse_message(String& message, int message_start) {
    // processes the message off Serial

    String msg_string = message.substring(message_start);
    msg_string = msg_string.substring(1, msg_string.lastIndexOf("}"));
    msg_string.replace(" ", "");
    msg_string.replace("\"", "");

#ifdef DEBUG
    Serial.println("Message:");
    Serial.println(msg_string);
#endif

    msg_string.toCharArray(buf, BUFLENGTH);

    // iterate over the tokens of the message - assumed flat.
    char *p = buf;
    char *str;

    uint8_t red = 0;
    uint8_t green = 0;
    uint8_t blue = 0;
    int16_t pos = -1;
    bool colour_change = false;

    while ((str = strtok_r(p, ",", &p)) != NULL) { 
#ifdef DEBUG
        Serial.println(str);
#endif

        char *tp = str;
        char *key; char *val;

        // get the key
        key = strtok_r(tp, ":", &tp);
        val = strtok_r(NULL, ":", &tp);

#ifdef DEBUG
        Serial.print("Key: ");
        Serial.println(key);
        Serial.print("val: ");
        Serial.println(val);
#endif

        if (*key == 'r' || *key == 'R') red = atoi(val);
        if (*key == 'g' || *key == 'G') green = atoi(val);
        if (*key == 'b' || *key == 'B') blue = atoi(val);
        if (*key == 'p' || *key == 'P') {
            if (*val == 'a' || *val == 'A') {
                pos = -1; // this means light them all up.
            } else {
                pos = atoi(val);
            }

        }
    }
    // if it's a colour change then lets change the colour.
    // also just check for the position too.

#ifdef DEBUG
    Serial.print(" RGB: (");
    Serial.print(red);
    Serial.print(",");
    Serial.print(green);
    Serial.print(",");
    Serial.print(blue);
    Serial.print(") P: ");
    Serial.println(pos);    
#endif

    // this just changes the value to the provided vals and limits if needed
    if (pos == -1) {
        for (uint16_t i = 0; i<STRIP_LENGTH; i++) {
            strip.setPixelColor(i, red, green, blue);
        }
    } else {
        strip.setPixelColor(pos, red, green, blue);
    }
    strip.show();
}
