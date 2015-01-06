#include "ws2812.h"
#include "Arduino.h"

Adafruit_NeoPixel strip = Adafruit_NeoPixel(STRIP_LENGTH, LED_PIN, NEO_GRB + NEO_KHZ800);

char buf[BUFLENGTH]; // character buffer for json message processing

void ws2812_initialise() {
    // initialises the strip
    strip.begin();
    strip.show();
}

void parse_message(String& message, int message_start) {
    // processes the message that has come in

    String msg_string = message.substring(message_start);
    msg_string = msg_string.substring(1, msg_string.lastIndexOf("}"));
    msg_string.replace(" ", "");
    msg_string.replace("\"", "");

#ifdef DEBUG
    Serial.println("Message:");
    Serial.println(msg_string);
#endif

    msg_string.toCharArray(buf, BUFLENGTH);

    // iterate over the tokens of the message - assumed flat json structure.
    char *p = buf;
    char *str;

    int16_t pos = -1;
    uint32_t colour = 0;

    while ((str = strtok_r(p, ",", &p)) != NULL) { // keep parsing tokens until none left
#ifdef DEBUG
        Serial.println(str);
#endif

        char *tp = str;
        char *key; char *val;

        // get the key and it's value.
        key = strtok_r(tp, ":", &tp);
        val = strtok_r(NULL, ":", &tp);

#ifdef DEBUG
        Serial.print("Key: ");
        Serial.println(key);
        Serial.print("val: ");
        Serial.println(val);
#endif

        if (*key == 'a') {
            colour = atol(val);
            pos = -1;
        } else if (*key == 's') {
            // doesn't matter value, just do a show
            strip.show();
        } else if (atoi(key) >= 0 ) {
            // this sets a value
            pos = atoi(key);
            colour = atol(val);
        }
    }

#ifdef DEBUG
    Serial.print(" C: ");
    Serial.print(colour);
    Serial.print(" P: ");
    Serial.println(pos);
#endif

    // this just changes the value to the provided vals and limits if needed
    if (pos == -1) {
        // set the whole strand the same colour
        for (uint16_t i = 0; i<STRIP_LENGTH; i++) {
            strip.setPixelColor(i, colour);
        }
    } else {
        // set a pixel
        strip.setPixelColor(pos, colour);
    }
}
