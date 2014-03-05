// Gruntfile for tetris

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: {
                    'dest/tetris.min.js': ['src/tetris.js']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['src/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['uglify']);
};
