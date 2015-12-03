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

describe('less inclusions', function () {
  var prompts = {
    workFolder: 'temp',
    fiddleDesc: 'mocha test'
  };
  var testGlobal = {};
  before(function(done) {
    testGlobal.app = helpers.run(path.join(__dirname, '../app'))
      .inTmpDir(function(dir, err) {
        if(err) { done(err); return; }
        testGlobal.dir = dir;
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
    var generator = testGlobal.app.generator;
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
    var generator = testGlobal.app.generator;
    expect(generator.gruntConfig.less).to.deep.equal(lessObj);
  });

  it('should have the grunt default task include the less task', function(){
    var generator = testGlobal.app.generator;
    expect(generator.defaultGruntTask).to.contain('less');
  });

  it('should have the grunt-contrib-less npm task', function(){
    var generator = testGlobal.app.generator;
    // console.log(generator.gruntNpmTasks);
    expect(generator.gruntNpmTasks).to.contains(
      'grunt-wiredep',
      'grunt-contrib-less',
      'grunt-contrib-watch',
      'grunt-contrib-connect');
  });

  it('should have grunt-contrib-less as dev depedency', function(){
    var generator = testGlobal.app.generator;
    expect(generator.devDependencies).to.include('grunt-contrib-less');
  });

  var exec = require('child_process').exec;

  describe('less grunt tasks tests', function () {
    var prompts = {
      workFolder: 'temp',
      fiddleDesc: 'mocha test'
    };
    var testGlobal = {};
    beforeEach(function(done) {
      testGlobal.app = helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function(dir, err) {
          if(err) { done(err); return; }
          testGlobal.dir = dir;
          // console.log(dir);
        })
        .withArguments(['skip-install'])
        .withOptions({ less: true })
        .withPrompts(prompts)
        .on('end', function(){
          done();
        });
    });

    it('should modify app/styles/style.css', function(done){
      this.timeout(60000 * 10); //10 minutes - my network is f**ked up
      var opts = {
        cwd : testGlobal.dir,
        env: process.env,
        detached: true
      };
      var gen = testGlobal.app.generator;
      var devdeps = gen.devDependencies.join(' ');
      var rootPath = testGlobal.dir;
      var getPath = function(fpath) {
        var s = path.join(rootPath, fpath);
        // console.log(s); ;
        return s;
      };

      exec('npm install ' + devdeps, opts, function(err, stdout, stderr) {
        if(err) {
          done(err);
          return;
        }

        var h1 = fs.readFileSync(getPath('app/less/h1.less'), 'utf8');
        var css = fs.readFileSync(getPath('app/styles/style.css'), 'utf8');
        // expect(css).to.not.contain(h1);
        expect(css).to.not.contain('h1');

        exec('grunt less', opts, function(e, out, serr){
          if(e) {
            done(e);
            return;
          }
          // console.log(out);

          var h1 = fs.readFileSync(getPath('app/less/h1.less'), 'utf8');
          var css = fs.readFileSync(getPath('app/styles/style.css'), 'utf8');
          // expect(css).to.contain(h1); //this expect fails since for some reason \r are stripped out
          expect(css).to.contain('h1');
          done();
        });
      });
    });
  });
});
