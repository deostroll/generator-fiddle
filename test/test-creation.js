/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var yeoman = require('yeoman-generator')
var helpers = yeoman.test, assert = yeoman.assert;
var fs = require('fs');
var expect = require('chai').expect;

describe('plain fiddle', function () {
  var prompts = {
    workFolder: 'temp',
    fiddleDesc: 'mocha test'
  };
  var self = this;
  before(function(done) {
      self.app = helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function(dir, err) {
          if(err) { done(err); return; }
          self.tempDir = dir;
          // console.log('directory:', dir, typeof(dir));
        })
        .withArguments(['skip-install'])
        .withPrompts(prompts)
        .on('end', function(){
          done();
        });
  });

  it('creates expected files', function () {
      var expected = [
          // add files you expect to exist here.
          '.jshintrc',
          '.editorconfig',
          'bower.json',
          'Gruntfile.js',
          'app/index.html',
          'app/images/yeoman.png',
          'app/styles/style.css',
          'app/scripts/main.js',
          'package.json'
      ];

      assert.file(expected);

  });

  it('modifies bower.json to reflect the work folder', function(){
    var tempDir = self.tempDir;
    expect(tempDir).to.not.be.undefined;
    var bowerFile = path.join(tempDir, 'bower.json');
    var bower = JSON.parse(fs.readFileSync(bowerFile, 'utf8'));
    expect(bower.name).to.equal(prompts.workFolder);

  });

  it('modifies package.json to reflect the work folder and all devDependencies', function(){
    var tempDir = self.tempDir;
    var pkgFile = path.join(tempDir, 'package.json');
    var pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
    expect(pkg.name).to.equal(prompts.workFolder);
    var gen = self.app.generator;
    // var allDeps = gen.getAllDevDependencies();
    // var expectObjContains = expect(pkg.devDependencies).to.contain;
    // expectObjContains.keys.apply(expectObjContains, allDeps);
    expect(pkg.devDependencies).to.include.keys(
      'grunt',
      'grunt-contrib-watch',
      'grunt-contrib-connect',
      'grunt-wiredep'
    );

  });

  it('should load required grunt npm tasks', function(){
    var gen = self.app.generator;
    expect(gen.gruntNpmTasks).to.contain(
      'grunt-contrib-connect',
      'grunt-contrib-watch',
      'grunt-wiredep'
    );
  });

  it('should have grunt wiredep config', function(){
    var config = {
      app: {
        src: ['app/*.html']
      }
    };
    var gen = self.app.generator;
    expect(gen.gruntConfig.wiredep).to.deep.equal(config);
  });

  it('should have grunt watch config', function(){
    var config = {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      app: {
        files:['./**/*.{html,js,css}', '!bower_components'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      }
    };
  });

  it('should have grunt connect config', function() {
    var config = {
      options: {
        livereload:4586,
        port:3000,
        open: true,
        base: ['app'],
        hostname: 'localhost'
      },
      app: {}
    };

    var gen = self.app.generator;
    expect(gen.gruntConfig.connect).to.deep.equal(config);
  });
});
