var firmata = require("firmata");
var repl = require("repl");

var serialport = "/dev/ttyUSB0";

var red = 0, green = 0, blue = 0;

var board = new firmata.Board(serialport, function (error) {
    if (error) {
        console.log(error);
        return;
    }

    console.log('Connected to ' + serialport);
    console.log('Firmware: ' +
        board.firmware.name + '-' +
        board.firmware.version.major + '.' +
        board.firmware.version.minor
        );

    var context = repl.start("RGB>").context;
//    context.sses = sendSysExString;
    context.sendPixel = sendPixel;
    context.rainbow = rainbow;
    context.sendPackedPixel = sendPackedPixel;

    board.on('string', function(data) {
        var message = '';

        for (var index = 0, length = data.length; index < length; index += 2) {
            message += String.fromCharCode(
                ((data.charCodeAt(index+1) & 0x7F) << 7) +
                (data.charCodeAt(index)   & 0x7F)
                );
        }

        if (messageHandler != null) messageHandler(message);
    });
});

function colour_loop () {
    // make a loop here that iterates through the colours.

}

function rainbow(pixels) {
    // create a rainbow across the number of pixels you have. Goes R > G > B
    var freq = 0.3;
    var amp = 127;
    var centre = 128; 

    var msg = "";

    for (var i = 0; i< pixels; i++) {
        setTimeout(function(n){
                var r = Math.floor(Math.sin(freq*n + 0)*amp + centre);
                var g = Math.floor(Math.sin(freq*n + 2)*amp + centre);
                var b = Math.floor(Math.sin(freq*n + 4)*amp + centre);
                
                var rgb = (r<<16) + (g<<8) + b
                sendPackedPixel(rgb, n);
        }, i*50, i);
    }
}

var sendPackedPixel = function (rgb, pos) {
    // sets a pixel using a packed rgb value. Easiest way to supply this is
    // to send it as a hex value using 0xRRGGBB format.
    
    msg = "{p:" + pos + ",c:" + rgb + "}";

    //if (send) {
        sendSysExString(msg);
    //} else {
    //    return (msg);
    //}

}


var sendPixel = function(red, green, blue, pos) {
    // sets a pixel colour at a particular position
    // if send is true then send it, if not then return it

    //var send = send || false;
    var send = true;

    msg = "{r:" + red +  ",g:" + green + ",b:" + blue + ",p:" + pos + "}";
    console.log(msg);
    if (send) {
        sendSysExString(msg);
    } else {
        return (msg);
    }
}


var sendSysExString = function(message) {
// sends an actual sysex string message

    var START_SYSEX = 0xF0;
    var STRING_DATA = 0x71;
    var END_SYSEX   = 0xF7;

    var buffer = new Buffer(message + '\0', 'utf8');
    var data   = [];

    data.push(START_SYSEX);
    data.push(STRING_DATA);

    for (var index = 0, length = buffer.length; index < length; index ++) {
        data.push(buffer[index] & 0x7F);
        data.push((buffer[index] >> 7) & 0x7F);
    }

    data.push(END_SYSEX);

    board.sp.write(data);
}


