module.exports = function(grunt) {

    // load npm tasks for grunt-* libs, excluding grunt-cli
    require('matchdep').filterDev('grunt-*').filter(function(pkg) {
      return ['grunt-cli'].indexOf(pkg) < 0;
    }).forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options : {
                livereload: true
            },
            source: {
                files: [
                    'src/index.js',
                    'Gruntfile.js'
                ],
                tasks: [ 'build:js' ]
            }
        },

        concat: {
            dist: {
                src: [
                    'src/index.js'
                ],
                dest: 'dist/webjackport.js',
            }
        }
    });

    /* Default (development): Watch files and build on change. */
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', [
        'concat:dist'
    ]);

};
