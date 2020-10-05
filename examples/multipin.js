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
    controller: 'FIRMATA',
    strips: [ {pin: 6, length: 8}, {pin: 7, length: 8}]
  });

  strip.on('ready', function() {
    console.log('Strip ready');

    const colors = ['red', 'green', 'blue'];
    const current_colors = [0,1,2];
    const pixel_list = [0,1,2];
    const blinker = setInterval(function() {
      strip.color('#000'); // blanks it out
      for (let i=0; i< pixel_list.length; i++) {
        if (++pixel_list[i] >= strip.length) {
          pixel_list[i] = 0;
          if (++current_colors[i] >= colors.length) current_colors[i] = 0;
        }
        strip.pixel(pixel_list[i]).color(colors[current_colors[i]]);
      }

      strip.show();
    }, 1000/fps);
  });

  strip.on('error', function(err) {
    console.log(err);
    process.exit();
  });
});
