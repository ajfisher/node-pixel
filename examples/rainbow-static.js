/**
 * This example shows how to use node-pixel to display a set of rainbow colors
 * on your NeoPixel strip using Johnny-Five.
 *
 * created by @pierceray in June 2015
 */
var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

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
        for(var i = 0; i < strip.length; i++) {
            showColor = colorWheel( ( (i+10)*256 / strip.length ) & 255 );
            strip.pixel(i).color( showColor);
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
