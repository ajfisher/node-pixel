// This example shows how to use node-pixel
// to control multiple strips on the same board

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
        data: 8,
        length: 8,
        board: this,
        controller: "FIRMATA",
        strip_id: 0,
    });

    strip2 = new pixel.Strip({
        data: 6,
        length: 8,
        board: this,
        controller: "FIRMATA",
        strip_id: 1,
    });

    strip3 = new pixel.Strip({
        data: 4,
        length: 8,
        board: this,
        controller: "FIRMATA",
        strip_id: 2,
    });

    strip.on("ready", function() {

        console.log("Strip ready 1");

        var colors = ["red", "green", "blue"];
        var current_colors = [0,1,2];
        var current_pos = [0,1,2];
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
        }, 150);
    });

    strip2.on("ready", function() {

        console.log("Strip 2 ready");

        var colors = ["black", "white"];
        var current_colors = 0;

        var blinker2 = setInterval(function() {
            if (++current_colors >= colors.length) current_colors = 0;
            strip2.color(colors[current_colors]); // blanks it out
            strip2.show();
        }, 1000);
    });

    strip3.on("ready", function() {

        console.log("Strip 3 ready");

        var colors = ["magenta", "yellow", "orange", "cyan"];
        var current_colors = 0;

        var blinker3 = setInterval(function() {
            if (++current_colors >= colors.length) current_colors = 0;
            strip3.color(colors[current_colors]); // blanks it out
            strip3.show();
        }, 1500);
    });
});
