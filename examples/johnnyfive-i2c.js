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
    color_order: pixel.COLOR_ORDER.GRB,
    board: this,
    controller: 'I2CBACKPACK',
    strips: [8]
  });

  strip.on('ready', function() {
    console.log("Strip ready, let's go");

    const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white'];
    const current_colors = [0,1,2,3,4];
    const current_pos = [0,1,2,3,4];
    const blinker = setInterval(function() {
      strip.color('#000'); // blanks it out

      for (let i=0; i< current_pos.length; i++) {
        if (++current_pos[i] >= strip.length) {
          current_pos[i] = 0;
          if (++current_colors[i] >= colors.length) current_colors[i] = 0;
        }
        strip.pixel(current_pos[i]).color(colors[current_colors[i]]);
      }

      strip.show();
    }, 1000/fps);
  });
});
