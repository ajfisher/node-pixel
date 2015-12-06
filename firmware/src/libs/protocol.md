# Protocol used to talk to the pixel strip using firmata

This is the definition of the protocol used to talk to the LED strips. The
protocol is largely the same whether you are using custom firmata or I2C
backpack in order to keep things simple.

There are some exceptions to this, notably around configuration.

## Multi strip protocol consideration.

In the instance of multiple physical strips being attached to multiple pins on
the board, the protocol interface remains the same however the strips are
_logically_ joined end to end in the order they are allocated during the config
phase. It is up to the caller to pass the appropriate pixel value in order
to ensure that the strips are mapped to the correct sequence.

## Protocol Pixel Command Instructions.

```
#define PIXEL_OFF               0x00 // set strip to be off
#define PIXEL_CONFIG            0x01 // configure the strip
#define PIXEL_SHOW              0x02 // latch the pixels and show them
#define PIXEL_SET_PIXEL         0x03 // set the color value of pixel n using 32bit packed color value
#define PIXEL_SET_STRIP         0x04 // set color of whole strip
#define PIXEL_SHIFT             0x05 // shift all the pixels n places along the strip
//      PIXEL_RESERVED          0x08-0x0F // Reserved for future instructions.
```

### Config

Sets the pins that the pixel strips use and length of the strips. This is given
using 10 bits thus providing for 1023 pixels on each strip (note this is a
theoretical maximum). If using firmata then a pin number will need to be supplied
whereas a backpack does not.

```
0   START_SYSEX             0xF0
1   PIXEL_COMMAND           0x51
2   PIXEL_CONFIG            0x01
3   Colour order (int value use upper 2 bits 0-3 GRB=0 default)
3   [Pin Number] OPTIONAL (int value use lower 5 bits Pin 0-31)
4   10 bit strand length LSB
5   10 bit strand length MSB (upper 4 bits future reserved)
... Repeat bytes 3..5 for up to 8 LED strips max
N   END_SYSEX               0xF7
```

#### Colour order definitions.

Colour ordering is given by:

```
0x00    GRB (Default)
0x01    RGB
0x02    BRG
```

### Show

Latches the frame and triggers sending the data down the wire.

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
2   PIXEL_SHOW          0x02
3   END_SYSEX           0xF7
```

### Set Strip Colour

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

### Set Pixel Colour

Sets a given pixel to a particular color

```
0   START_SYSEX         0xF0
1   PIXEL_COMMAND       0x51
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
2   PIXEL_SHIFT         0x05
3   Shift
3     bits 0-5 provide number of LEDs to shift (range 0-31),
3     bit 6 direction 0=add to current position, 1=subtract
3     bit 7 wrap behaviour 0=no wrapping, 1= wrapping
4   END_SYSEX           0xF7
```


