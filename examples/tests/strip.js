// This example will test blinking the entire strip through the colour
// sequence.

var five = require("johnny-five");
var pixel = require("../../lib/pixel.js");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 1; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        data: 6,
        length: 17,
        board: this
    });

    var pos = 0;
    var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
    var current_color = 0;

    var blinker = setInterval(function() {

        if (++current_color>= colors.length) current_color = 0;
        strip.color(colors[current_color]);
        strip.show();
    }, 1000/fps);
});
