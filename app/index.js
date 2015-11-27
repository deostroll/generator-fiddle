'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var FiddleGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');
        this.mkdir = mkdirp;
        this.devDependencies = [
            //commn dependencies
            'grunt',
            'grunt-contrib-connect',
            'grunt-contrib-watch',
            'grunt-wiredep'
        ];

        this.on('end', function(){
          console.log(chalk.green('All done...'));
          console.log();
          console.log('type "grunt" to start a local web server');
        });
    },

    prompting: function (){
      if(this.options['fast']) {
        this.props = {
          workFolder: this.appname,
          fiddleDesc: 'a quick fiddle'
        }
        return;
      }
      var done = this.async();
      var prompts = [
        {
          name: 'workFolder',
          type: 'input',
          message: 'Enter fiddle name',
          default: this.appname
        },
        {
          name: 'fiddleDesc',
          type: 'input',
          message: 'What do you want to fiddle with?',
          default: 'Just another fiddle'
        }
      ];
      this.prompt(prompts, function(props){
        this.props = props;
        done();
      }.bind(this));
    },
    app: function () {
        this.mkdir('app');
        this.mkdir('app/images');
        this.mkdir('app/styles');
        this.mkdir('app/scripts');

        this.fs.copyTpl(
          this.templatePath('app/index.html'),
          this.destinationPath('app/index.html'),
          this.props
        );

        this.copy('app/styles/style.css', 'app/styles/style.css');
        this.copy('app/scripts/main.js', 'app/scripts/main.js');
        this.copy('app/images/yeoman.png', 'app/images/yeoman.png');
        
        // We'll compose our grunt file
        // this.copy('Gruntfile.js', 'Gruntfile.js');

        // this.copy('package.json', 'package.json');
        // this.copy('bower.json', 'bower.json');
        this.fs.copyTpl(this.templatePath('package.json'), 'package.json', this.props);
        this.fs.copyTpl(this.templatePath('bower.json'), 'bower.json', this.props);

        this.copy('bowerrc', '.bowerrc');
        this.copy('README.md', 'README.md');
    },

    projectFiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
    },

    gruntConfig: function() {
      var stringify = function(obj) {
        return JSON.stringify(obj, null, 2);
      };

      var watchConfig = {
        'app': {
          files: ['app/**/*.{html,js,css}', '!app/bower_components/**/*.*'],
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          'bower' : ['bower.json'],
          'task' : ['wiredep']
        }
      };

      this.gruntfile.insertConfig('watch', stringify(watchConfig));

      var connectConfig = {
        options: {
          port: 3000,
          livereload: 4586,
          open: true,
          base: ['app'],
          hostname: 'localhost'
        },
        app: {
        }
      };
      this.gruntfile.insertConfig('connect', stringify(connectConfig));

      var wiredepConfig = {
        app: {
          src: ['app/*.html']
        }
      };

      this.gruntfile.insertConfig('wiredep', stringify(wiredepConfig));

      this.gruntfile.loadNpmTasks([
        'grunt-contrib-watch',
        'grunt-contrib-connect',
        'grunt-wiredep'
      ]);

      this.gruntfile.registerTask('default', ['connect', 'watch']);
    },
    installStuff: function() {
      this.npmInstall(this.devDependencies, {saveDev: true});
    }
});

module.exports = FiddleGenerator;
