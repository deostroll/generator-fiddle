'use strict';

var yeoman = require('yeoman-generator');

var FiddleGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');

        this.devDependencies = [
            //commn dependencies
            'grunt',
            'grunt-contrib-connect',
            'grunt-contrib-watch'
        ];
    },
    prompting: {
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
          message: 'What do you want to fiddle with?'
        }
      ];
      this.prompt(prompts, function(props){
        this.props = props;
        done();
      }.bind(this));
    }
    app: function () {
        this.mkdir('app');
        this.mkdir('app/images');
        this.mkdir('app/styles');
        this.mkdir('app/scripts');
        this.mkdir('app/less');

        this.copy('app/index.html', 'app/index.html');
        this.copy('app/less/application.less', 'app/less/application.less');
        this.copy('express.js', 'express.js');
        this.copy('Gruntfile.js', 'Gruntfile.js');
        this.copy('package.json', 'package.json');
        this.copy('bower.json', 'bower.json');
        this.copy('bowerrc', '.bowerrc');
        this.copy('README.md', 'README.md');
    },

    projectFiles: function () {
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');
    }
});

module.exports = FiddleGenerator;
