# Creating a rainbow effect

This example uses a 16 LED strip and a custom rainbow calculator to create a
nice rainbow that moves dynamically. This example uses a custom firmata.

To install the custom firmata, see the [Installation Guide](installation.md).

## Wiring

Wire the neopixel strip up as shown below.

![Wiring diagram](breadboard/custom_firmata_bb.png)

## Example code

```js
var five = require("johnny-five");
var { Strip } = require("node-pixel-async");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

/**
 * how many frames per second do you want to try?
 */
var fps = 20;

board.on("ready", function() {

    console.log("Board ready, lets add light");

    // setup the node-pixel strip.
    strip = Strip({
        data: 6,
        length: 17, // number of pixels in the strip.
        board: this,
        controller: "FIRMATA"
    });

    strip.on("ready", function() {
        console.log("Strip ready, let's go");
        dynamicRainbow(fps);
    });

    function dynamicRainbow( delay ){
        console.log( 'dynamicRainbow' );

        var showColor;
        var cwi = 0; // colour wheel index (current position on colour wheel)
        var foo = setInterval(function(){
            if (++cwi > 255) {
                cwi = 0;
            }

            for(var i = 0; i < strip.length; i++) {
                showColor = colorWheel( ( cwi+i ) & 255 );
                strip.pixel( i ).color( showColor );
            }
            strip.show();
        }, 1000/delay);
    }

    // Input a value 0 to 255 to get a color value.
    // The colors are a transition r - g - b - back to r.
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
node examples/rainbow-dynamic.js
```

You can optionally pass a port in as a parameter.
