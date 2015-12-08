global.IS_TEST_MODE = true;
var mocks = require("mock-firmata");
var MockFirmata = mocks.Firmata;
var MockSerialPort = mocks.SerialPort;

var sinon = require("sinon");

var five = require("johnny-five");
var pixel = require("../lib/pixel.js");

var Board = five.Board;

function newBoard() {
    var sp = new MockSerialPort("/dev/test");
    var io = new MockFirmata(sp);

    io.emit("connect");
    io.emit("ready");

    var board = new Board({
        io: io,
        debug: false,
        repl: false,
    });

    return board;
}

function restore(target) {
    for (var prop in target) {

        if (Array.isArray(target[prop])) {
            continue;
        }

        if (target[prop] != null && typeof target[prop].restore === "function") {
            target[prop].restore();
        }

        if (typeof target[prop] === "object") {
            restore(target[prop]);
        }
    }
}

exports["Test Mode configured"] = {
    setUp: function(done) {
        done();
    },

    tearDown: function(done) {
        done();
    },

    testMode: function(test) {
        // tests that the env variable is set properly
        test.expect(1);
        test.equal(process.env.IS_TEST_MODE, 'true', "Is test mode configured properly");
        test.done();
    },
};

exports["Strip - Firmata"] = {
    setUp: function(done){

        this.write = sinon.stub(MockSerialPort.prototype, "write", function(buffer, callback) {
            if (typeof callback === "function") {
                process.nextTick(callback);
            } else {
                return;
            }
        });

        this.board = newBoard();
        done();
    },

    tearDown: function(done) {
        Board.purge();
        restore(this);
        done();
    },

    stripReady: function(test) {
        // tests if the strip emits the ready event properly.
        test.expect(3);

        var strip = new pixel.Strip({
            data: 6,
            length: 8,
            board: this.board,
            controller: "FIRMATA",
        });

        test.equal(this.write.callCount, 1, "Write only called for config");

        strip.on("ready", function() {
            test.ok(true, "Ready emitter working");
            test.equal(strip.stripLength(), 8, "Strip length correct");
            test.done();
        });
    },

    stripColour: function(test) {
        // tests if the colour sequences are working okay
        test.expect(4);

        var strip = new pixel.Strip({
            data: 6,
            length:4,
            board: this.board,
            controller: "FIRMATA",
        });

        strip.on("ready", function() {

            var colourcheck = {
                r: 255, g: 255, b: 255,
                hexcode: "#FFFFFF",
                color: "white",
                rgb: [255, 255, 255],
            };

            strip.color("#FFFFFF");
            test.deepEqual(strip.pixel(0).color(), colourcheck, "Check colours set");

            colourcheck = {
                r: 255, g: 0, b: 0,
                hexcode: "#FF0000",
                color: "red",
                rgb: [255, 0, 0],
            };

            strip.color("#F00");
            test.deepEqual(strip.pixel(1).color(), colourcheck, "Check colours updated");

            colourcheck = {
                r: 0, g: 0, b: 255,
                hexcode: "#0000FF",
                color: "blue",
                rgb: [0, 0, 255],
            };

            strip.color("blue");
            test.deepEqual(strip.pixel(2).color(), colourcheck, "Colour set using name");

            colourcheck = {
                r: 0, g: 255, b: 0,
                hexcode: "#00FF00",
                color: "lime",
                rgb: [0, 255, 0],
            };

            strip.color([0, 255, 0]);
            test.deepEqual(strip.pixel(3).color(), colourcheck, "Colour set using RGB array");


            test.done();
        });
    },

    numberOfStripsMax: function(test) {
        // tests that the number of strips available is bounded.
        test.expect(1);

        try {
            // this should fail.
            var strip = new pixel.Strip({
                board: this.board,
                controller: "FIRMATA",
                strips: [8, 8, 8, 8, 8, 8, 8, 8, 8]
            });
        } catch (e) {
            if (e instanceof(RangeError)) {
                test.ok(true, "Max exceeded out of range");
                errFound = true;
            } else {
                test.ok(false, "Max exceeded error of incorrect type");
            }
            test.done();
            return;
        }
        test.ok(false, "Maximum was exceeded and it let it through");
        test.done();
    },

    numberOfPixelsMax: function(test) {
        // test the number of pixels available is bounded properly.

        test.expect(2);
        var errFound = false;

        // first try with a single strip pixels.
        try {
            // this should fail.
            var strip1 = new pixel.Strip({
                board: this.board,
                controller: "FIRMATA",
                strips: [ {pin: 6, length: 257}, ]
            });
        } catch (e) {
            if (e instanceof(RangeError)) {
                test.ok(true, "Max pixels exceeded range for one strip");
                errFound = true;
            } else {
                test.ok(false, "Max pixels exceeded error of incorrect type");
                errFound = true;
            }
        }

        if (! errFound) {
            test.ok(false, "Maximum pixels was exceeded and it let it through");
        }

        errFound = false;

        // now we try with multiples.
        try {
            // this should fail.
            var strip2 = new pixel.Strip({
                board: this.board,
                controller: "FIRMATA",
                strips: [   {pin: 2, length: 64},
                            {pin: 2, length: 64},
                            {pin: 2, length: 64},
                            {pin: 2, length: 64},
                            {pin: 2, length: 64},
                        ], // more than 256
            });
        } catch (e) {
            if (e instanceof(RangeError)) {
                test.ok(true, "Max pixels exceeded out of range multipin");
                errFound = true;
            } else {
                test.ok(false, "Max pixels exceeded error of incorrect type");
                errFound = true;
            }
            test.done();
            return;
        }
        if (! errFound) {
            test.ok(false, "Maximum pixels was exceeded on multipin and it let it through");
        }

        test.done();
    },

    stripLength: function(test) {
        // tests length of the strip properly.
        test.expect(3);

        var strip = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{pin: 2, length: 100}]
        });
        test.equal(strip.stripLength(), 100, "Single strips length correct");

        var strip2 = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{pin: 2, length: 100}, {pin: 3, length: 100}]
        });
        test.equal(strip2.stripLength(), 200, "Multiple strips length correct");

        var strip3 = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            pin: 3,
            length: 150,
        });
        test.equal(strip3.stripLength(), 150, "Shorthand strips length correct");

        test.done();

    },
}



exports["Pixel - Firmata"] = {
    setUp: function(done){

        this.write = sinon.stub(MockSerialPort.prototype, "write", function(buffer, callback) {
            if (typeof callback === "function") {
                process.nextTick(callback);
            } else {
                return;
            }
        });

        this.board = newBoard();

        this.strip = new pixel.Strip({
            data: 6,
            length: 4,
            board: this.board,
            controller: "FIRMATA",
        });

        done();
    },

    tearDown: function(done) {
        Board.purge();
        restore(this);
        done();
    },

    pixelColour: function(test) {
        // tests if the colour sequences are working okay
        test.expect(4);


            var colourcheck = {
                r: 255, g: 255, b: 255,
                hexcode: "#FFFFFF",
                color: "white",
                rgb: [255, 255, 255],
            };

            this.strip.pixel(0).color("#FFFFFF");
            test.deepEqual(this.strip.pixel(0).color(), colourcheck, "Check colours set");

            colourcheck = {
                r: 255, g: 0, b: 0,
                hexcode: "#FF0000",
                color: "red",
                rgb: [255, 0, 0],
            };

            this.strip.pixel(1).color("#F00");
            test.deepEqual(this.strip.pixel(1).color(), colourcheck, "Check colours updated");

            colourcheck = {
                r: 0, g: 0, b: 255,
                hexcode: "#0000FF",
                color: "blue",
                rgb: [0, 0, 255],
            };

            this.strip.pixel(2).color("blue");
            test.deepEqual(this.strip.pixel(2).color(), colourcheck, "Colour set using name");

            colourcheck = {
                r: 0, g: 255, b: 0,
                hexcode: "#00FF00",
                color: "lime",
                rgb: [0, 255, 0],
            };

            this.strip.pixel(3).color([0, 255, 0]);
            test.deepEqual(this.strip.pixel(3).color(), colourcheck, "Colour set using RGB array");

            test.done();

    },

}




