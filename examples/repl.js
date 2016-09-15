// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.
const five = require("johnny-five");
const pixel = require("../lib/pixel.js");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        data: 6,
        length: 8,
        color_order: pixel.COLOR_ORDER.GRB,
        board: this,
        controller: "FIRMATA",
        //strips: [8],
    });

    strip.on("ready", function() {

        console.log("Strip ready, let's go");
        console.log("You can now interact with the strip using the repl using the `strip` object");

        strip.color("#000");
        strip.pixel(1).color("red");
        strip.show();
        board.repl.inject({
            strip: this,
        });
    });
});
