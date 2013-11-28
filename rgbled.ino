/** Example to work with standard firmata and an FT controllable LED

    Author:     Andrew Fisher
    Version:    0.1

**/

//#define DEBUG

#include <string.h>
#include <stdlib.h>

#include <Firmata.h>

#if MAX_DATA_BYTES < 64
#error "Firmata.h: MAX_DATA_BYTES should be increased to 64"
#endif


// will probably not need next bit when moving to Firmata
#define BUFLENGTH 32
char buf[BUFLENGTH]; // character buffer for json processing
int bufCount; // counter for the string buffer.

// define the clock and signal bits
int CKI = 2;
int SDI = 3;

#define STRIP_LENGTH 2 // Number of RGBLED modules connected

long ind_colours[STRIP_LENGTH]; // actual individual modules.

struct colour_module {
  int r;
  int g;
  int b;
};

struct colour_module modules[STRIP_LENGTH];


void setup() {

    pinMode(CKI, OUTPUT);
    pinMode(SDI, OUTPUT);

    firmataInitialize();

    //Serial.begin(9600);
    //Serial.println("RGB LED control. Type {R: [0-255], G: [0-255], B: [0-255], P:[0-N]}<ENTER>");
    for (int i=0; i<STRIP_LENGTH; i++) {
        modules[i].r = 0;
        modules[i].g = 0;
        modules[i].b = 0;
    }
}

void loop() {

    //if (Serial.available() > 10) {

    //    SerialParse();
    //}

    if (Firmata.available()) {
        Firmata.processInput();
    }


    for (int i=0; i < STRIP_LENGTH; i++) {
        if (modules[i].r == 0 && modules[i].g == 0 && modules[i].b == 0) {
            ind_colours[i] = 0;
        } else {
            ind_colours[i] = get_colour(modules[i].r, modules[i].g, modules[i].b);
        }
    }

    post_set(ind_colours);
    delay(1);
}

#define QUERY_FIRMWARE  0x79

void firmataInitialize(void) {
    Firmata.setFirmwareNameAndVersion("rgbled.ino", 2, 3);

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
    
    int red = 0;
    int green = 0;
    int blue = 0;
    int pos = -1;
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
      if (*key == 'p' || *key == 'P') pos = atoi(val);
      
    }

    // if it's a colour change then lets change the colour.
    // also just check for the position too.
    if (pos < STRIP_LENGTH) {
      
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
      if ((modules[pos].r = red ) > 255) modules[pos].r = 255;
      if ((modules[pos].g = green ) > 255) modules[pos].g = 255;
      if ((modules[pos].b = blue ) > 255) modules[pos].b = 255;

      #ifdef DEBUG
      Serial.print(" RGB: (");
      Serial.print(modules[pos].r);
      Serial.print(",");
      Serial.print(modules[pos].g);
      Serial.print(",");
      Serial.print(modules[pos].b);
      Serial.print(") P: ");
      Serial.println(pos);    
      #endif
    }
}

// stuff here for posting colours

long get_colour(int red, int green, int blue) {
    // given an 8 bit value for a colour channel, return the
    // long version of it.
    long r = (long) red<<16;
    long g = (long) green<<8; 
    long b = (long) blue;  
    return (r + g + b);
}

void post_set(long *modules) {
    // takes the full set of modules and then posts the data appropriately
    for (int led_index =0; led_index < STRIP_LENGTH; led_index++) {
        write_to_module(modules[led_index]);
    }

    //Pull clock low to put strip into reset/post mode
    digitalWrite(CKI, LOW);
    delayMicroseconds(500); //Wait for 500us to go into reset
}

void write_to_module(long led_colour) {
    // this method actually writes the colour that is provided to the module string

    for(byte color_bit = 23 ; color_bit != 255 ; color_bit--) {
        //Feed color bit 23 first (red data MSB)

        digitalWrite(CKI, LOW); //Only change data when clock is low

        long mask = 1L << color_bit;
        //The 1'L' forces the 1 to start as a 32 bit number, otherwise it defaults to 16-bit.
        if (led_colour & mask) {
            digitalWrite(SDI, HIGH);
        } else {
            digitalWrite(SDI, LOW);
        }

        digitalWrite(CKI, HIGH); //Data is latched when clock goes high
    }
}



