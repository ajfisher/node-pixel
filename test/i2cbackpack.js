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

exports["Strip - I2C"] = {
    setUp: function(done){

        this.board = newBoard();
        this.clock = sinon.useFakeTimers();
        this.i2cConfig = sinon.spy(MockFirmata.prototype, "i2cConfig");
        this.i2cWrite = sinon.stub(MockFirmata.prototype, "i2cWrite", function(i2caddr, data) {
            return;
        });

        done();
    },

    tearDown: function(done) {
        this.i2cConfig.restore();
        this.i2cWrite.restore();
        this.clock.restore();
        done();
    },

    stripReady: function(test) {
        // tests if the strip emits the ready event properly.

        test.expect(4);
        var strip = new pixel.Strip({
            data: 6,
            length: 8,
            board: this.board,
            controller: "I2CBACKPACK",
        });

        // emit the ready event ahead of time.

        test.equal(this.i2cConfig.callCount, 1, "I2C Config called once in config.");

        strip.on("ready", function() {
            test.equal(this.i2cWrite.callCount, 1, "I2C Write called as part of config");
            test.ok(true, "Ready emitter working");
            test.equal(strip.stripLength(), 8, "Strip length correct");
            test.done();
        }.bind(this));
    },

    numberOfStripsMax: function(test) {
        // tests that the number of strips available is bounded.
        test.expect(1);

        try {
            // this should fail.
            var strip = new pixel.Strip({
                board: this.board,
                controller: "I2CBACKPACK",
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
                controller: "I2CBACKPACK",
                strips: [ 600 ]
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
            controller: "I2CBACKPACK",
        });

        strip.on("ready", function() {
            test.equal(this.i2cWrite.callCount, 1, "Write called as part of setup");
            strip.show();
            test.equal(this.i2cWrite.callCount, 2, "Show called once after setup");
            test.done();
        }.bind(this));

    }
};

exports["Pixel - I2C"] = {
    setUp: function(done){

        this.board = newBoard();
        this.clock = sinon.useFakeTimers();
        this.i2cConfig = sinon.spy(MockFirmata.prototype, "i2cConfig");
        this.i2cWrite = sinon.stub(MockFirmata.prototype, "i2cWrite", function(i2caddr, data) {
            return;
        });

        this.strip = new pixel.Strip({
            data: 6,
            length: 4,
            board: this.board,
            controller: "I2CBACKPACK",
        });

        done();
    },

    tearDown: function(done) {
        this.i2cConfig.restore();
        this.i2cWrite.restore();
        this.clock.restore();
        done();
    },

    writing: function(test) {
        // tests to see whether the write to the pixel is going out properly
        test.expect(1);
        this.strip.pixel(0).color("#FFF");
        test.equal(this.i2cWrite.callCount, 1, "Write pixel value to I2C");
        test.done()
    },
}
