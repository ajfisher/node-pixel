// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.
var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 20; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        data: 6,
        length: 8,
        color_order: pixel.COLOR_ORDER.GRB,
        board: this,
        controller: "FIRMATA",
    });

    strip.on("ready", function() {

        console.log("Strip ready, let's go");

        var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
        var current_colors = [0,1,2,3,4];
        var current_pos = [0,1,2,3,4];
        var blinker = setInterval(function() {

            strip.color("#000"); // blanks it out

            for (var i=0; i< current_pos.length; i++) {
                if (++current_pos[i] >= strip.stripLength()) {
                    current_pos[i] = 0;
                    if (++current_colors[i] >= colors.length) current_colors[i] = 0;
                }
                strip.pixel(current_pos[i]).color(colors[current_colors[i]]);
            }

            strip.show();
        }, 1000/fps);
    });
});
