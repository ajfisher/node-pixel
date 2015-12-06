# Basic Johnny Five example

This example uses johnny five to control a neopixel strip using an I2C backpack.

To install the I2C backpack, see the [Installation Guide](installation.md).

## Wiring

Wire the neopixel strip up as shown below. This can be done on any I2C compatible
board that Johnny Five supports. This example uses a Raspberry Pi.

![Wiring diagram](breadboard/i2c_backpack_bb.png)

TODO: Add an arduino as well.

### I2C LED pins

Note that you can't specify the pins to use when using I2C. As such you must
start with pin 2 and work upwards from there to 10 max.

## Example code


## Running

To run the example:

```
node examples/johnnyfive-i2c.js
```

You can optionally pass a port in as a parameter.
