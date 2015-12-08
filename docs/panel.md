# Using a panel and Strip Color

This example uses a 8x8 LED panel and `strip.color()` to change the entire panel.

To install the custom firmata, see the [Installation Guide](installation.md).

## Wiring

Wire the neopixel panel up as shown below.

![Wiring diagram](breadboard/panel_bb.png)

## Example code

```js
var five = require("johnny-five");
var pixel = require("node-pixel");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 1; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        data: 6,
        length: 64,
    });

    strip.on("ready", function() {

        console.log("Strip ready, let's go");

        var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
        var current_colors = 0;
        var blinker = setInterval(function() {

            if (++current_colors >= colors.length) current_colors = 0;
            strip.color(colors[current_colors]); // blanks it out
            strip.show();
        }, 1000/fps);
    });
});
```

## Running

To run the example:

```
node examples/panel.js
```

You can optionally pass a port in as a parameter.
