/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var yeoman = require('yeoman-generator')
var helpers = yeoman.test, assert = yeoman.assert;
var fs = require('fs');
var expect = require('chai').expect;
var fetchJson = function(file) {
  var data = fs.readFileSync(file, 'utf8');
  return JSON.parse(data);
};

describe('fiddle with less', function () {
  var prompts = {
    workFolder: 'temp',
    fiddleDesc: 'mocha test'
  };
  // var testGlobal = {};
  var self = this;
  before(function(done) {
    self.app = helpers.run(path.join(__dirname, '../app'))
      .inTmpDir(function(dir, err) {
        if(err) { done(err); return; }
        self.dir = dir;
        // console.log(dir);
      })
      .withArguments(['skip-install'])
      .withOptions({ less: true })
      .withPrompts(prompts)
      .on('end', function(){
        done();
      });
  });

  it('should create less folder and files', function() {
    assert.file(['app/less', 'app/less/main.less', 'app/less/h1.less']);
  });

  it('should have grunt watch tasks for less', function(){
    var lessObj = {
      less: {
        files: ['app/less/*.less'],
        tasks: ['less']
      }
    };
    // expect(testGlobal.app._gruntConfig.watch).shallowDeepEqual(lessObj);
    var generator = self.app.generator;
    expect(generator).to.not.be.undefined;
    expect(generator.gruntConfig).to.not.be.undefined;
    expect(generator.options).to.be.an.object;
    expect(generator.gruntConfig.watch.less).to.not.be.undefined;
    expect(generator.gruntConfig.watch.less).to.deep.equal(lessObj.less);
  });

  it('should have grunt less task configuration', function(){
    var lessObj = {
      dev: {
        options: {
          paths: ['app/less']
        },
        files: {
          'app/styles/style.css' : 'app/less/main.less'
        }
      }
    };
    var generator = self.app.generator;
    expect(generator.gruntConfig.less).to.deep.equal(lessObj);
  });

  it('should have the correct dependencies in package.json', function(){
    var file = path.join(self.dir, 'package.json');
    var pkg = fetchJson(file);
    expect(pkg.devDependencies).to.contain.keys(
      'grunt',
      'grunt-wiredep',
      'grunt-contrib-less',
      'grunt-contrib-connect',
      'grunt-contrib-watch'
    );
  });

  it('should have the grunt default task include the less task', function(){
    var generator = self.app.generator;
    expect(generator.defaultGruntTask).to.contain('less');
  });

  it('should have the grunt-contrib-less npm task', function(){
    var generator = self.app.generator;
    // console.log(generator.gruntNpmTasks);
    expect(generator.gruntNpmTasks).to.contains(
      'grunt-wiredep',
      'grunt-contrib-less',
      'grunt-contrib-watch',
      'grunt-contrib-connect');
  });

  it('should have grunt-contrib-less as dev depedency', function(){
    var generator = self.app.generator;
    expect(generator.devDependencies).to.include('grunt-contrib-less');
  });



});
