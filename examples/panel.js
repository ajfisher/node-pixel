
// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.

var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

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
