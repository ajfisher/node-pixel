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
        controller: "FIRMATA",
        strips: [ {pin: 6, length: 8}, {pin: 7, length: 8},]
    });

    strip.on("ready", function() {

        console.log("Strip ready");

        var colors = ["red", "green", "blue"];
        var current_colors = [0,1,2];
        var pixel_list = [0,1,2];
        var blinker = setInterval(function() {

            strip.color("#000"); // blanks it out
            for (var i=0; i< pixel_list.length; i++) {
                if (++pixel_list[i] >= strip.length) {
                    pixel_list[i] = 0;
                    if (++current_colors[i] >= colors.length) current_colors[i] = 0;
                }
                strip.pixel(pixel_list[i]).color(colors[current_colors[i]]);
            }

            strip.show();
        }, 1000/fps);
    });

    strip.on("error", function(err) {
        console.log(err);
        process.exit();
    });
});
