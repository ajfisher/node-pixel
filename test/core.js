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
        test.equal(strip.stripLength(), 100, "Single strips length correct");

        var strip2 = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            strips: [{pin: 2, length: 50}, {pin: 3, length: 50}]
        });
        test.equal(strip2.stripLength(), 100, "Multiple strips length correct");

        var strip3 = new pixel.Strip({
            board: this.board,
            controller: "FIRMATA",
            pin: 3,
            length: 150,
        });
        test.equal(strip3.stripLength(), 150, "Shorthand strips length correct");

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
        test.deepEqual(this.strip.pixel(0).color(), colourcheck, "Check colours set");

        colourcheck = {
            r: 255, g: 0, b: 0,
            hexcode: "#FF0000",
            color: "red",
            rgb: [255, 0, 0],
        };

        this.strip.color("#F00");
        test.deepEqual(this.strip.pixel(1).color(), colourcheck, "Check colours updated");

        colourcheck = {
            r: 0, g: 0, b: 255,
            hexcode: "#0000FF",
            color: "blue",
            rgb: [0, 0, 255],
        };

        this.strip.color("blue");
        test.deepEqual(this.strip.pixel(2).color(), colourcheck, "Colour set using name");

        colourcheck = {
            r: 0, g: 255, b: 0,
            hexcode: "#00FF00",
            color: "lime",
            rgb: [0, 255, 0],
        };

        this.strip.color([0, 255, 0]);
        test.deepEqual(this.strip.pixel(3).color(), colourcheck, "Colour set using RGB array");

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
        test.deepEqual(this.strip.pixel(0).color(), colourcheck, "Check strip is off");

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
};
