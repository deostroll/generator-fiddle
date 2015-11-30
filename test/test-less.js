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

describe('testing less inclusions', function () {
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
      })
      .withArguments(['skip-install', 'less'])
      .withPrompts(prompts)
      .on('end', function(){
        done();
      });
  });

  it('should create less folder and files', function(done) {
    assert(['less', 'less/main.less']);
    done();
  });

  it('should include less grunt packages', function(done) {
    expect(testGlobal.dir).to.not.be.undefined;
    expect(testGlobal.dir).to.be.a('string');
    var file = path.join(testGlobal.dir, 'package.json');
    var pkg = fetchJson(file);
    expect(pkg.devDependencies).to.contain.keys('grunt-contrib-less')
    done();
  });

});
