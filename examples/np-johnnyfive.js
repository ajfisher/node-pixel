// This example shows how to use node-pixel using Johnny Five as the 
// hook for the board.

var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 35; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        data: 6,
        length: 17,
        board: this
    });

    var pos = 0;
    var pos2 = 1;
    var pos3 = 2;
    var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
    var current_color = 0;
    var current_color2 = 1;
    var current_color3 = 2;

    var blinker = setInterval(function() {

        strip.color("#000"); // blanks it out

        if (++pos >= strip.stripLength()) {
            pos = 0;
            if (++current_color>= colors.length) current_color = 0;
        }
        strip.pixel(pos).color(colors[current_color]);

        if (++pos2 >= strip.stripLength()) {
            pos2 = 0;
            if (++current_color2>= colors.length) current_color2 = 0;
        }
        strip.pixel(pos2).color(colors[current_color2]);

        if (++pos3 >= strip.stripLength()) {
            pos3 = 0;
            if (++current_color3>= colors.length) current_color3 = 0;
        }
        strip.pixel(pos3).color(colors[current_color3]);
        strip.show();
    }, 1000/fps);
});
