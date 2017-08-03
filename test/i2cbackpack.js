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
        this.i2cWrite = sinon.stub(MockFirmata.prototype, "i2cWrite").callsFake(function(i2caddr, data) {
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

    i2cControllerConfig: function(test) {
        // ensures that the configuration of the controller works correctly

        test.expect(1);

        test.throws(
            () => {
                var strip = new pixel.Strip({
                    data: 6,
                    length: 8,
                    board: {},
                    controller: "I2CBACKPACK",
                });
            },
            function(err) {
                if (err) {
                    if (err.name == "NoIOError") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            "If IO is not present an error should be thrown"
        );

        test.done();

    },

    stripReady: function(test) {
        // tests if the strip emits the ready event properly.

        test.expect(3);
        var strip = new pixel.Strip({
            data: 6,
            length: 8,
            board: this.board,
            controller: "I2CBACKPACK",
        });

        // emit the ready event ahead of time.

        test.equal(this.i2cConfig.callCount, 1,
                "I2C Config should be called only once during config.");

        strip.on("ready", function() {
            test.equal(this.i2cWrite.callCount, 1,
                    "I2C Write should be called once as part of config");
            test.ok(true,
                    "If configuration is complete a ready even should be emitted");
            test.done();
        }.bind(this));
    },

    maxNumberOfStrips: function(test) {
        test.expect(1);

        test.throws(
            () => {
                var strip = new pixel.Strip({
                    board: this.board,
                    controller: "I2CBACKPACK",
                    strips: [8, 8, 8, 8, 8, 8, 8, 8, 8]
                });
            },
            function (err)  {
                if (err instanceof RangeError) {
                    return true;
                }
            },
            "Excessive number of strips should throw a RangeError"
        );

        test.done();
    },

    maxNumberOfPixels: function(test) {
        test.expect(2);

        test.throws(
            () => {
                var strip1 = new pixel.Strip({
                    board: this.board,
                    controller: "I2CBACKPACK",
                    strips: [ 600 ]
                });
            },
            function (err) {
                if (err instanceof RangeError) {
                    return true;
                }
            },
            "Excess pixels in a single strip should throw a RangeError"
        );

        test.throws(
            () => {
                var strip2 = new pixel.Strip({
                    board: this.board,
                    controller: "I2CBACKPACK",
                    strips: [ 100, 100, 100, 100, 100, 100, 100, ]
                });
            },
            function (err) {
                if (err instanceof RangeError) {
                    return true;
                }
            },
            "Excess pixels in multiple strips should throw a RangeError"
        );
        test.done();

    },
    show: function(test) {
        // tests if the strip calls the show out to I2C properly.
        //
        test.expect(1);

        var strip = new pixel.Strip({
            data: 6,
            length: 8,
            board: this.board,
            controller: "I2CBACKPACK",
        });

        strip.on("ready", function() {
            strip.show();
            // first call count will be for the setup call
            test.equal(this.i2cWrite.callCount, 2,
                    "i2cWrite should be called only once during show");
            test.done();
        }.bind(this));

    },

    color: function(test) {
        // aims for coverage tests to ensure that colours are set properly.
        //
        test.expect(2);

        var strip = new pixel.Strip({
            data: 6,
            length: 8,
            board: this.board,
            controller: "I2CBACKPACK",
        });

        strip.on("ready", function() {

            strip.color("red");
            // first call count will be for the setup call
            test.equal(this.i2cWrite.callCount, 2,
                    "i2cWrite should be called only once during colour setting");

            strip.shift(1, pixel.FORWARDS, true);
            test.equal(this.i2cWrite.callCount, 3,
                    "i2cWrite should be called only once during shift call");

            test.done();
        }.bind(this));

    },
};

exports["Pixel - I2C"] = {
    setUp: function(done){

        this.board = newBoard();
        this.clock = sinon.useFakeTimers();
        this.i2cConfig = sinon.spy(MockFirmata.prototype, "i2cConfig");
        this.i2cWrite = sinon.stub(MockFirmata.prototype, "i2cWrite").callsFake(function(i2caddr, data) {
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
        test.equal(this.i2cWrite.callCount, 1,
                "i2cWrite should only call once to write a pixel value");
        test.done()
    },
}
