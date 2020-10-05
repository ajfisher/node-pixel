// This example shows how to use node-pixel using firmata as the
// hook for the board.

const firmata = require('firmata');
const pixel = require('../lib/pixel.js');

const opts = {};
if (process.argv[2] == undefined) {
  console.log('Please supply a device port to connect to');
  process.exit();
}

opts.port = process.argv[2];

let strip = null;

const board = new firmata.Board(opts.port, function() {
  console.log('Firmata ready, lets add light');

  strip = new pixel.Strip({
    data: 6,
    length: 4,
    firmata: board
  });

  let pos = 0;
  const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white'];
  let current_color = 0;

  const blinker = setInterval(function() {
    strip.color('#000'); // blanks it out

    if (++pos >= strip.length) {
      pos = 0;
      if (++current_color>= colors.length) current_color = 0;
    }
    strip.pixel(pos).color(colors[current_color]);

    strip.show();
  }, 1000/2);
});
