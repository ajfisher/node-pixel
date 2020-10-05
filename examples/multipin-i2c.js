// This example shows how to use node-pixel
// to control multiple strips on the same board

const five = require('johnny-five');
const pixel = require('../lib/pixel.js');

const opts = {};
opts.port = process.argv[2] || '';

const board = new five.Board(opts);
let strip = null;

const fps = 30; // how many frames per second do you want to try?

board.on('ready', function() {
  console.log('Board ready, lets add light');

  strip = new pixel.Strip({
    board: this,
    controller: 'I2CBACKPACK',
    color_order: pixel.COLOR_ORDER.GRB,
    strips: [ 8, 8 ]
  });

  strip.on('ready', function() {
    console.log('Strip ready');

    const colors = ['red', 'green', 'blue'];
    const current_pos = [0,1,2];
    strip.color('#000'); // blanks it out
    current_pos.forEach((pos) => {
      strip.pixel(pos).color(colors[pos]);
    });
    strip.show();
    const blinker = setInterval(function() {
      strip.shift(1, pixel.FORWARD, true);
      strip.show();
    }, 1000/fps);
  });

  strip.on('error', function(err) {
    console.log(err);
    process.exit();
  });
});
