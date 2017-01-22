# Basic Firmata example

This example uses only Firmata to control a neopixel strip using a custom firmata.

To install the custom firmata, see the [Installation Guide](installation.md).

## Wiring

Wire the neopixel strip up as shown below.

![Wiring diagram](breadboard/custom_firmata_bb.png)

## Example code
```js
var firmata = require("firmata");
var pixel = require("node-pixel");

var opts = {};
if (process.argv[2] == undefined) {
    console.log("Please supply a device port to connect to");
    process.exit();
}

opts.port = process.argv[2];

var strip = null;

var board = new firmata.Board(opts.port, function() {

    console.log("Firmata ready, lets add light");

    strip = new pixel.Strip({
        data: 6,
        length: 4,
        firmata: board,
    });

    var pos = 0;
    var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
    var current_color = 0;

    var blinker = setInterval(function() {

        strip.color("#000"); // blanks it out

        if (++pos >= strip.length) {
            pos = 0;
            if (++current_color>= colors.length) current_color = 0;
        }
        strip.pixel(pos).color(colors[current_color]);

        strip.show();
    }, 1000/2);
});
```

## Running

To run the example:

```
node examples/firmata.js
```

You can optionally pass a port in as a parameter.
