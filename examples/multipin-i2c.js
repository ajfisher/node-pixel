// This example shows how to use node-pixel
// to control multiple strips on the same board

var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 30; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        board: this,
        controller: "I2CBACKPACK",
        color_order: pixel.COLOR_ORDER.GRB,
        strips: [ 8, 8 ]
    });

    strip.on("ready", function() {

        console.log("Strip ready");

        var colors = ["red", "green", "blue"];
        var current_pos = [0,1,2];
        strip.color("#000"); // blanks it out
        current_pos.forEach((pos) => {
            strip.pixel(pos).color(colors[pos]);
        });
        strip.show();
        var blinker = setInterval(function() {
            strip.shift(1, pixel.FORWARD, true);
            strip.show();
        }, 1000/fps);
    });

    strip.on("error", function(err) {
        console.log(err);
        process.exit();
    });
});
