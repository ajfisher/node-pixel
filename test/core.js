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
        test.equal(process.env.IS_TEST_MODE, 'true', "Test mode should be configured");
        test.done();
    },
};

exports["Strip"] = {
    // used for the main strip tests.
    setUp: function(done) {
        this.board = newBoard();
        this.strip = new pixel.Strip({
            data: 6,
            length: 8,
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

    length: function(test) {
        // tests length of the strip properly.
        test.expect(3)

        var strip = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{pin: 2, length: 100}]
        });
        test.equal(strip.length, 100, "Single strip length should be equal to provided length");

        var strip2 = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{pin: 2, length: 50}, {pin: 3, length: 50}]
        });
        test.equal(strip2.length, 100, "Multiple strips length should be equal to sum of lengths");

        var strip3 = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            pin: 3,
            length: 150,
        });

        test.throws(() => {
                strip3.stripLength()
            },
            /NotImplemented/,
            "Deprecated stripLength() should throw NotImplemented error");

        test.done();
    },

    colour: function(test) {
        // tests if the colour sequences are working okay
        test.expect(2);

        var colourcheck = {
            r: 255, g: 255, b: 255,
            hexcode: "#FFFFFF",
            color: "white",
            rgb: [255, 255, 255],
        };

        this.strip.color("#FFFFFF");
        test.deepEqual(this.strip.pixel(0).color(), colourcheck,
                "If colour is set with full hex colour, colour object should be updated");

        colourcheck = {
            r: 0, g: 255, b: 0,
            hexcode: "#00FF00",
            color: "lime",
            rgb: [0, 255, 0],
        };

        this.strip.color([0, 255, 0]);
        test.deepEqual(this.strip.pixel(3).color(), colourcheck,
                "If setting colour by RGB array, the colour object should be updated");

        test.done();
    },

    off: function(test) {
        // tests if setting strip off results in black pixel colour
        test.expect(1);

        this.strip.color("#FF0000");

        var colourcheck = {
            r: 0, g: 0, b: 0,
            hexcode: "#000000",
            color: "black",
            rgb: [0, 0, 0],
        };

        this.strip.off();
        test.deepEqual(this.strip.pixel(0).color(), colourcheck,
                "If setting a colour then turning the strip off, the colour should revert to off state.");
        test.done();
    },

    gamma: function(test) {
        // tests if setting the gamma works as expected
        test.expect(4);

        // test gamma being set
        var strip = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{pin: 2, length: 1}],
            gamma: 2.3
        });
        test.equal(strip.gamma, 2.3,
                "If setting gamma in constructor, the gamma value should be retained");

        test.equal(strip.gtable.length, 256,
                "If setting gamma in constructor, the Gamma Table should be built");

        test.equal(strip.gtable[18], 1,
                "If setting gamma, the gamma table values should be built correctly");

        // now check that a non gamma returns the right values
        var strip2 = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{pin: 2, length: 1}],
        });

        test.equal(strip2.gtable[18], 18,
                "If gamma is not set, the gamma values should be built using default");

        test.done();
    }
};

exports["Pixel"] = {
    setUp: function(done) {
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

    colour: function(test) {
        // tests if the colour sequences are working okay
        test.expect(2);

        var colourcheck = {
            r: 255, g: 255, b: 255,
            hexcode: "#FFFFFF",
            color: "white",
            rgb: [255, 255, 255],
        };

        this.strip.pixel(0).color("#FFFFFF");
        test.deepEqual(this.strip.pixel(0).color(), colourcheck,
                "If pixel colour is set, the pixel colour object should be updated");

        colourcheck = {
            r: 0, g: 255, b: 0,
            hexcode: "#00FF00",
            color: "lime",
            rgb: [0, 255, 0],
        };

        this.strip.pixel(3).color([0, 255, 0]);
        test.deepEqual(this.strip.pixel(3).color(), colourcheck,
                "If setting the pixel colour using RGB array, the pixel colour object should be updated");

        test.done();
    },
};
