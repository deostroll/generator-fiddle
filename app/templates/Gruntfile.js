'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt);

    grunt.initConfig({
        yeoman: {
            app: 'app'
        },
        less: {
            compile: {
                files: {
                    'app/styles/application.css': 'app/less/application.less'
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    'app/fonts/**/*.{eot, svg, ttf, woff}',
                    'app/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    'app/scripts/**/*.js',
                    'app/styles/**/*.css',
                    'app/*.html'
                ]
            },
            less: {
                options: {
                    atBegin: true
                },
                files: ['app/less/*.less'],
                tasks: ['less:compile']
            }
        },

        express: {
            all: {
                options: {
                    port: 9090,
                    hostname: '*',
                    bases: 'app',
                    livereload: true,
                    serverreload: false,
                    server: 'express.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('server', [
        'express',
        'watch'
    ]);
};