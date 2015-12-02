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
          'app/styles/style.css' : 'app/less/main.css'
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
});
