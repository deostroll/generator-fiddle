'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({
        yeoman: {
            app: 'app'
        },

        watch: {
            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    '<%= yeoman.app %>/fonts/**/*.{eot, svg, ttf, woff}',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.app %>/scripts/**/*.js',
                    '<%= yeoman.app %>/styles/**/*.css',
                    '<%= yeoman.app %>/*.html'
                ]
            }
        },

        express: {
            all: {
                options: {
                    port: 9090,
                    hostname: '*',
                    bases: 'app',
                    livereload: true,
                    serverreload: true,
                    server: 'express.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('server', [
        'express',
        'express-keepalive'
    ]);
};
