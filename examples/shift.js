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
        data: 7,
        length: 64,
        color_order: pixel.COLOR_ORDER.GRB,
        board: this,
        controller: "FIRMATA",
    });

    strip.on("ready", function() {

        console.log("Strip ready, let's go");

        strip.color("#000");
        strip.pixel(0).color("red");
        strip.pixel(1).color("red");
        strip.pixel(2).color("red");
        strip.pixel(5).color("blue");
        strip.pixel(6).color("blue");
        strip.show();
        var blinker = setInterval(function() {

            strip.shift(1, pixel.FORWARD, true);

            strip.show();
        }, 1000/fps);
    });
});
