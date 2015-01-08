# Protocol used to talk to the pixel strip

## Custom Firmata protocol

#define PIXEL_OFF           0x00 // set strip to be off
#define PIXEL_CONFIG        0x01 // set pin number and max length
#define PIXEL_SHOW          0x02 // latch the pixels and show them
#define PIXEL_SET_PIXEL     0x03 // set the color value of pixel n using 32bit packed color value        
#define PIXEL_SET_STRIP     0x04 // set color of whole strip


### Show

Latches the frame and triggers sending the data down the wire.

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   PIXEL_SHOW          0x02
3   END_SYSEX           0xF7
```

### PIXEL_SET_STRIP

Sets the whole strip to a particular color

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   PIXEL_SET_STRIP     0x04
3   24 bit packed RGB color value LSB
4   24 bit packed RGB color value lower middle bits
5   24 bit packed RGB color value upper middle bits
6   24 bit packed RGB color value MSB
7   END_SYSEX           0xF7
```

### PIXEL_SET_PIXEL

Sets a given pixel to a particular color

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   PIXEL_SET_STRIP     0x03
3   max 14 bit index of pixel in strip LSB
4   max 14 bit index of pixel in strip MSB
5   24 bit packed RGB color value LSB
6   24 bit packed RGB color value lower middle bits
7   24 bit packed RGB color value upper middle bits
8   24 bit packed RGB color value MSB
9   END_SYSEX           0xF7
```
