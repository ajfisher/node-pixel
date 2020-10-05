/**
 * This example shows how to use node-pixel to cycle colors through your
 * NeoPixel strip using Johnny-Five.
 *
 * adapted from the examples by @pierceray
 */
const five = require('johnny-five');
const pixel = require('../lib/pixel.js');

const opts = {};
opts.port = process.argv[2] || '';

const board = new five.Board(opts);
let strip = null;

/**
 * how many frames per second do you want to try?
 */
const fps = 30;

board.on('ready', function() {
  console.log('Board ready, lets add light');

  // setup the node-pixel strip.
  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [ {pin: 6, length: 8}, {pin: 7, length: 8}]
  });

  strip.on('ready', function() {
    console.log("Strip ready, let's go");
    dynamicRainbow(fps);
  });

  function dynamicRainbow( delay ) {
    console.log( 'dynamicRainbow' );

    let showColor;
    let cwi = 0; // colour wheel index (current position on colour wheel)
    const foo = setInterval(function() {
      if (++cwi > 255) {
        cwi = 0;
      }

      for (let i = 0; i < strip.length; i++) {
        showColor = colorWheel( ( cwi+i ) & 255 );
        strip.pixel( i ).color( showColor );
      }
      strip.show();
    }, 1000/delay);
  }

  // Input a value 0 to 255 to get a color value.
  // The colors are a transition r - g - b - back to r.
  function colorWheel( WheelPos ) {
    let r; let g; let b;
    WheelPos = 255 - WheelPos;

    if ( WheelPos < 85 ) {
      r = 255 - WheelPos * 3;
      g = 0;
      b = WheelPos * 3;
    } else if (WheelPos < 170) {
      WheelPos -= 85;
      r = 0;
      g = WheelPos * 3;
      b = 255 - WheelPos * 3;
    } else {
      WheelPos -= 170;
      r = WheelPos * 3;
      g = 255 - WheelPos * 3;
      b = 0;
    }
    // returns a string with the rgb value to be used as the parameter
    return 'rgb(' + r +',' + g + ',' + b + ')';
  }
});
