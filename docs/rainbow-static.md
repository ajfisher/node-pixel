# Creating a rainbow effect

This example uses a 16 LED strip and a custom rainbow calculator to create a
nice rainbow over a static area. This example uses a custom firmata.

To install the custom firmata, see the [Installation Guide](installation.md).

## Wiring

Wire the neopixel panel up as shown below.

![Wiring diagram](breadboard/custom_firmata_bb.png)

## Example code

```js
var five = require("johnny-five");
var pixel = require("node-pixel");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

board.on("ready", function() {

    console.log("Board ready, lets add light");

    // setup the node-pixel strip.
    strip = new pixel.Strip({
        data: 6,
        length: 16, // number of pixels in the strip.
        board: this,
        controller: "FIRMATA"
    });

    strip.on("ready", function() {
        console.log("Strip ready, let's go");

        staticRainbow();
    });

    function staticRainbow(){
        console.log('staticRainbow');

        var showColor;
        for(var i = 0; i < strip.stripLength(); i++) {
            showColor = colorWheel( ( i*256 / strip.stripLength() ) & 255 );
            strip.pixel( i ).color( showColor );
        }
        strip.show();
    }

    // Input a value 0 to 255 to get a color value.
    // The colours are a transition r - g - b - back to r.
    function colorWheel( WheelPos ){
        var r,g,b;
        WheelPos = 255 - WheelPos;

        if ( WheelPos < 85 ) {
            r = 255 - WheelPos * 3;
            g = 0;
            b = WheelPos * 3;
        } else if (WheelPos < 170) {
            WheelPos -= 85;
            r = 0;
            g = WheelPos * 3;
            b = 255 - WheelPos * 3;
        } else {
            WheelPos -= 170;
            r = WheelPos * 3;
            g = 255 - WheelPos * 3;
            b = 0;
        }
        // returns a string with the rgb value to be used as the parameter
        return "rgb(" + r +"," + g + "," + b + ")";
    }

});
```

## Running

To run the example:

```
node examples/rainbow-static.js
```

You can optionally pass a port in as a parameter.
