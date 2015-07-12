module.exports = function(grunt) {
 
  // configure the tasks
  grunt.initConfig({
 
    copy: {
      build: {
        cwd: 'firmware/src',
        src: [ '**' ],
        dest: 'firmware/build',
        expand: true
      },
    },
 
  });
 
  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
 
  // define the tasks
};
