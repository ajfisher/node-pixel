# Protocol used to talk to the pixel strip using firmata

## Protocol Pixel Command Instructions.

The pixel instructions are passed as the lower 4 bits in the message following
`PIXEL_COMMAND`. This leaves the top 3 bits free which are used to specify
which strip you are sending the message to. These top 3 bits are ORed with the
pixel commmand in order to keep the message tight. This also implies that 
max strips can only be 8.

For backwards compatibility this means the top three bits as 000 will always
point to the first strip.

```
#define PIXEL_OFF           0x00 // set strip to be off
#define PIXEL_CONFIG        0x01 // set pin number and max length
#define PIXEL_SHOW          0x02 // latch the pixels and show them
#define PIXEL_SET_PIXEL     0x03 // set the color value of pixel n using 32bit packed color value        
#define PIXEL_SET_STRIP     0x04 // set color of whole strip
#define PIXEL_SHIFT         0x05 // shift all the pixels n places along the strip
//      PIXEL_RESERVED      0x06-0x0F // Reserved for future instructions.
```

### Config

Sets the pin that the pixel strip uses and length of strip (10 bits, 1023 pixels)

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   Strip ID (int using 3 upper bits to designate strips 0-7)
2   PIXEL_CONFIG        0x01
3   Pin Number (int value use lower 5 bits Pin 0-31, top 2 future reserved)
4   10 bit strand length LSB 
5   10 bit strand length MSB (upper 4 bits future reserved)
6   END_SYSEX           0xF7
```


### Show

Latches the frame and triggers sending the data down the wire.

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   Strip ID (int using 3 upper bits to designate strips 0-7)
2   PIXEL_SHOW          0x02
3   END_SYSEX           0xF7
```

### Set Strip Colour

Sets the whole strip to a particular color

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   Strip ID (int using 3 upper bits to designate strips 0-7)
2   PIXEL_SET_STRIP     0x04
3   24 bit packed RGB color value LSB
4   24 bit packed RGB color value lower middle bits
5   24 bit packed RGB color value upper middle bits
6   24 bit packed RGB color value MSB
7   END_SYSEX           0xF7
```

### Set Pixel Colour

Sets a given pixel to a particular color

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   Strip ID (int using 3 upper bits to designate strips 0-7)
2   PIXEL_SET_PIXEL     0x03
3   max 14 bit index of pixel in strip LSB
4   max 14 bit index of pixel in strip MSB
5   24 bit packed RGB color value LSB
6   24 bit packed RGB color value lower middle bits
7   24 bit packed RGB color value upper middle bits
8   24 bit packed RGB color value MSB
9   END_SYSEX           0xF7
```

### Shift pixels - PROPOSAL

Shifts the pixels along the strip N places. Direction flag specifies direction
and wrap flag determines if pixels move off the "end" of the strip are placed
back on the other end.

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   Strip ID (int using 3 upper bits to designate strips 0-7)
2   PIXEL_SHIFT         0x05
3   Shift 
3     bits 0-5 provide number of LEDs to shift (range 0-31), 
3     bit 6 direction 0=add to current position, 1=subtract
3     bit 7 wrap behaviour 0=no wrapping, 1= wrapping
4   END_SYSEX           0xF7
```


