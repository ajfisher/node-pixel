// This example does a fade through each of the 7 primary colour channels
// it's primarily used to ensure we get a good transition and allows you
// to tune gamma corrections if you need to.
// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.

var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 40; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 8}, {pin: 8, length: 8},],
        gamma: 2.8,
    });

    strip.on("ready", function() {

        console.log("Strip ready, let's go");

        strip.color('#000000');
        strip.show();
        let colors = ["red", "green", "blue", "yellow", "cyan", "magenta"];
        let current_color = 0;
        let fade_level = 0;
        let fade_up = true;
        var fader = setInterval(function() {

            if (fade_up) {
                // fading upwards, if we hit the top then turn around
                // and go back down again.
                if (++fade_level > 255) {
                    fade_up = false;
                }
            } else {
                if (--fade_level < 0) {
                    fade_up = true;
                    fade_level = 0;
                    if (++current_color >= colors.length) current_color = 0;
                }
            }

            let hc = "";
            switch (colors[current_color]) {
                case "red":
                    hc = `rgb(${fade_level}, 0, 0)`;
                    break;
                case "green":
                    hc = `rgb(0, ${fade_level}, 0)`;
                    break;
                case "blue":
                    hc = `rgb(0, 0, ${fade_level})`;
                    break;
                case "white":
                    hc = `rgb(${fade_level}, ${fade_level}, ${fade_level})`;
                    break;
                case "yellow":
                    hc = `rgb(${fade_level}, ${fade_level}, 0)`;
                    break;
                case "magenta":
                    hc = `rgb(${fade_level}, 0, ${fade_level})`;
                    break;
                case "cyan":
                    hc = `rgb(0, ${fade_level}, ${fade_level})`;
                    break;
            }

            // need to do this by pixel
            for (let i = 0; i < strip.length; i++) {
                strip.pixel(i).color(hc);
            }
            //strip.color(hc);
            strip.show();
        }, 1000/fps);
    });
});

