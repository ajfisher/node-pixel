// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.
var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 10; // how many frames per second do you want to try?

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
        //var current_colors = [0,1,2,3,4];
        var current_pos = [0,1,2,3,4];

        current_pos.forEach((pos) => {
            strip.pixel(pos).color(colors[pos]);
        });

        var blinker = setInterval(function() {

            strip.shift(1, pixel.FORWARD, true);

            strip.show();
        }, 1000/fps);
    });
});
