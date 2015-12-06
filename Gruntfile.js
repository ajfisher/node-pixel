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
                src: [ 'libs/**', '!libs/protocol.md', 'controller_src/firmata/*' ],
                dest: 'firmware/build/node_pixel_firmata/',
                expand: true,
                filter: 'isFile',
            },
            backpack: {
                cwd: 'firmware/src/',
                flatten: true,
                src: [ 'libs/ws2812/*', 'libs/lightws2812/*', '!libs/protocol.md', 'controller_src/backpack/*' ],
                dest: 'firmware/build/backpack/',
                expand: true,
                filter: 'isFile',
            },
        },
        clean: {
            build: {
                src: [
                        'firmware/build/node_pixel_firmata',
                        'firmware/build/backpack',
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
    grunt.loadNpmTasks('grunt-todo');

    grunt.registerTask('build', ['clean', 'copy']);

    grunt.registerTask('test', ['nodeunit', ]);
};
