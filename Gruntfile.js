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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', 'Log some stuff', function() {
        grunt.log.write('logging some stuff...').ok();
    });
    grunt.registerTask('build', ['uglify']);
};
