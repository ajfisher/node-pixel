
// This example shows how to use node-pixel using Johnny Five as the
// hook for the board.

const five = require('johnny-five');
const pixel = require('../lib/pixel.js');

const opts = {};
opts.port = process.argv[2] || '';

const board = new five.Board(opts);
let strip = null;

const fps = 1; // how many frames per second do you want to try?

board.on('ready', function() {
  console.log('Board ready, lets add light');

  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    data: 6,
    length: 64
  });

  strip.on('ready', function() {
    console.log("Strip ready, let's go");

    const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white'];
    let current_colors = 0;
    const blinker = setInterval(function() {
      if (++current_colors >= colors.length) current_colors = 0;
      strip.color(colors[current_colors]); // blanks it out
      strip.show();
    }, 1000/fps);
  });
});
