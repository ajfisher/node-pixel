// This example shows how to use node-pixel
// to control multiple strips on the same board

const five = require('johnny-five');
const pixel = require('../lib/pixel.js');

const opts = {};
opts.port = process.argv[2] || '';

const board = new five.Board(opts);
let strip = null;

const fps = 10; // how many frames per second do you want to try?

board.on('ready', function() {
  console.log('Board ready, lets add light');

  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [
      {pin: 2, length: 8}, {pin: 3, length: 8},
      {pin: 4, length: 8}, {pin: 5, length: 8},
      {pin: 6, length: 8}, {pin: 7, length: 8},
      {pin: 8, length: 8}, {pin: 9, length: 8}
    ]
  });

  strip.on('ready', function() {
    console.log('Strip ready');

    const strips = 8;
    const lengths = 8;

    const current_pos = new Array();
    for (let i=0; i< strips; i++) {
      current_pos.push(new Array());
    }

    // periodically drop a new item onto one of the strips randomly.
    const dripper = setInterval(function() {
      const s = Math.round(Math.random()*strips);
      try {
        current_pos[s].push(0);
      } catch (e) {
        if (e instanceof TypeError) {
          // this usually happens if we're splicing and writing at the
          // same time.
          return;
        }
      }
    }, 75);


    const iterator = setInterval(function() {
      strip.color('#000'); // blanks it out

      for (let i=0; i< current_pos.length; i++) {
        for (let j=0; j< current_pos[i].length; j++) {
          if (current_pos[i][j] >= 8) {
            current_pos[i].splice(j, 1);// remove the item
          } else {
            strip.pixel(i * lengths + current_pos[i][j]).color('#440');
            current_pos[i][j]++;
          }
        }
      }
      strip.show();
    }, 1000/fps);
  });
});
