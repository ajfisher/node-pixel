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
        test.expect(2);

        var strip = new pixel.Strip({
            data: 6,
            length: 8,
            board: this.board,
            controller: "FIRMATA",
        });

        test.equal(this.write.callCount, 1, "Write only called for config");

        strip.on("ready", function() {
            test.ok(true, "Ready emitter working");
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
                strips: [ {pin: 6, length: 200}, ]
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

    show: function(test) {
        // tests if the strip calls the show out to I2C properly.
        //
        test.expect(2);

        var strip = new pixel.Strip({
            data: 6,
            length: 8,
            board: this.board,
            controller: "FIRMATA",
        });

        strip.on("ready", function() {
            test.equal(this.write.callCount, 1, "Write called as part of setup");
            strip.show();
            test.equal(this.write.callCount, 2, "Show called once after setup");
            test.done();
        }.bind(this));

    }

};

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

    writing: function(test) {
        // tests to see whether the write to the pixel is going out properly
        test.expect(1);
        this.strip.pixel(0).color("#FFF");
        test.equal(this.write.callCount, 2, "Write pixel value to serial");
        test.done()
    },
};

