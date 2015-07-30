module.exports = function(grunt) {
 
    // configure the tasks
    grunt.initConfig({
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
                src: [ 'libs/neopixel/*', 'libs/ws2812/*', '!libs/protocol.md', 'controller_src/backpack/*' ],
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
    });
 
    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['clean', 'copy']);

};
