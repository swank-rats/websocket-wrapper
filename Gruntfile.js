module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        mochacli: {
            options: {
                require: [],
                reporter: 'spec',
                bail: true
            },
            all: ['test/*.js']
        },
        watch: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/*.js'],
            tasks: ['jshint', 'mocha']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint', 'mochacli']);

    grunt.registerTask('default', ['jshint']);
};
