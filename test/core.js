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
    io["firmware"] = { name: "node_pixel_firmata.ino", };

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
        test.expect(3);

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
        test.expect(4);

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

        test.doesNotThrow(
            () => {
                this.strip.colour("QWERTYUIOP");
            },
            undefined,
            "An invalid color should be ignored not throw an error"
        );

        test.doesNotThrow(
            () => {
                this.strip.color();
            },
            undefined,
            "When no colour is provided it should be ignored and not throw an error"
        );

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
    },

    shift: function(test) {
        // tests that wrapping behaviour is consistent

        test.expect(12);

        var strip = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{ pin: 2, length: 8}],
        });

        // set up a pixel on either end of the strip
        // in preparation for movement.
        strip.pixel(1).color("red");
        strip.pixel(6).color("blue");

        // call a shift but it shouldn't do anything
        strip.shift(0, pixel.FORWARD, false);
        test.equal(strip.pixel(1).color().color, "red",
            "If pixels are advanced by 0 elements, pixel 1 should stay the same");

        // advance the pixels one step along the strip.
        strip.shift(1, pixel.FORWARD, false);

        test.equal(strip.pixel(7).color().color, "blue",
            "If pixels are advanced one position, pixel 6 value should be on pixel 7");

        test.equal(strip.pixel(7).address, 7,
            "After pixels are shifted, pixel address should be updated again");

        test.equal(strip.pixel(6).color().color, "black",
            "If pixels are advanced one position, pixel 5 value should overwrite pixel 6");

        test.equal(strip.pixel(0).color().color, "black",
            "If pixels advance with no wrapping, pixel 0 value should be off");

        strip.shift(1, pixel.BACKWARD, false);

        test.equal(strip.pixel(6).color().color, "blue",
            "If pixels are reversed one position, pixel 7 value should be on pixel 6");

        test.equal(strip.pixel(5).color().color, "black",
            "If pixels are reversed one position, pixel 6 value should overwrite pixel 5");

        test.equal(strip.pixel(7).color().color, "black",
            "If pixels reverse with no wrapping, pixel 7 value should be off");

        // now we are back to starting spot let's do a multistep advancement
        // with a wrap around.

        strip.shift(2, pixel.FORWARD, true);

        test.equal(strip.pixel(3).color().color, "red",
            "If pixels are advanced 2 positions & wrapped, pixel 1 value should be on pixel 3");

        test.equal(strip.pixel(0).color().color, "blue",
            "If pixels are advanced 2 positions & wrapped, pixel 6 value should be on pixel 0");

        // now let's test a jump over the length of the strip.
        strip.shift(9, pixel.BACKWARD, true);

        test.equal(strip.pixel(7).color().color, "blue",
            "If pixels are reversed more than strip length (9), pixel 0 should be on pixel 7");

        // make sure there's nothing dangling behind.
        test.equal(strip.pixel(6).color().color, "black",
            "If pixels are shifted and wrapped, original pixel should have moved");

        test.done();

    },
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
        test.expect(3);

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

        test.doesNotThrow(
            () => {
                this.strip.pixel(1).colour("QWERTYUIOP");
            },
            undefined,
            "An invalid color should be ignored not throw an error"
        );

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

        this.strip.pixel(1).off();
        test.deepEqual(this.strip.pixel(1).color(), colourcheck,
                "If setting a colour then turning a pixel off, the colour should revert to off state.");
        test.done();
    },
};
