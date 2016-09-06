var arduino = process.env.ARDUINO_PATH;

var boards = require("./firmware/boards.js");
var boardlist = Object.keys(boards).toString();

module.exports = function(grunt) {

    // configure the tasks
    grunt.initConfig({
        nodeunit: {
            options: {
                reporter: "verbose",
            },
            tests: [
                "test/*js",
                ],
        },
        copy: {
            options: {
                timestamp: true,
            },

            firmata: {
                cwd: 'firmware/src/',
                flatten: true,
                src: [
                    'libs/firmata/arduino/*.{cpp,h}',
                    'libs/ws2812/*',
                    'libs/lightws2812/*',
                    '!libs/protocol.md',
                    'controller_src/firmata/*'
                ],
                dest: 'firmware/build/node_pixel_firmata/',
                expand: true,
                filter: 'isFile',
            },
            backpack: {
                cwd: 'firmware/src/',
                flatten: true,
                src: [
                    'libs/ws2812/*',
                    'libs/lightws2812/*',
                    '!libs/protocol.md',
                    'controller_src/backpack/*'
                ],
                dest: 'firmware/build/backpack/',
                expand: true,
                filter: 'isFile',
            },
        },
        clean: {
            firmware_build: {
                src: [
                        'firmware/build/node_pixel_firmata',
                        'firmware/build/backpack',
                     ]
            },
            compiled_bins: {
                src: [
                        'firmware/bin/backpack/*',
                        'firmware/bin/firmata/*'
                    ]
            },
            post_compile: {
                src: [
                        'firmware/bin/backpack/{' + boardlist + '}/!(*ino.hex)',
                        'firmware/bin/firmata/{' + boardlist + '}/!(*ino.hex)'
                ]
            },
        },
        watch: {
            scripts: {
                files: ['firmware/src/**/*'],
                tasks: ['build'],
                options: {
                    spawn: false,
                },
            },
            todo: {
                files: [
                    'firmware/src/**/*',
                    'lib/*',
                ],
                tasks: ['todo'],
                options: {
                    spawn: false,
                },
            },
        },
        todo: {
            options: {
                title: "Current tasks",
                logOutput: true,
                marks: [
                    {
                        name: "FIX",
                        pattern: "/FIXME/",
                        color: "red"
                    },
                    {
                        name: "TODO",
                        pattern: /TODO/,
                        color: "yellow"
                    }
                ],
                file: "todo.md",
                githubBoxes: false,
                colophon: true,
                usePackage: true
            },
            src: [
                'firmware/src/**',
                'test/**',
                'examples/**',
                'lib/*',
                '!firmware/src/libs/firmata/*',
            ]
        },
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-todo');

    // dynamically create the compile targets for the various boards
    Object.keys(boards).forEach(function(key) {
        grunt.config(["exec", "firmata_" + key], {
            command:function() {
                return arduino + " --verify --verbose-build --board "  + boards[key].package +
                " --pref build.path=firmware/bin/firmata/" + key +  " firmware/build/node_pixel_firmata/node_pixel_firmata.ino";
            },
        });
        grunt.config(["exec", "backpack_" + key], {
            command:function() {
                return arduino + " --verify --verbose-build --board "  + boards[key].package +
                " --pref build.path=firmware/bin/backpack/" + key +  " firmware/build/backpack/backpack.ino";
            },
        });
    });

    grunt.registerTask('build', ['clean:firmware_build', 'clean:compiled_bins', 'copy']);
    grunt.registerTask('compile', ['build', 'exec', 'clean:post_compile']);

    grunt.registerTask('test', ['nodeunit', ]);
};
