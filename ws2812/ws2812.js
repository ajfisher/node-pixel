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

    repl.start("RGB>").context.sses = sendSysExString;

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



