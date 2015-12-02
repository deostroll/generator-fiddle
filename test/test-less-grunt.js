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
var exec = require('child_process').exec;

describe('less grunt tasks', function () {
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
      env: process.env
    };

    exec('npm install', opts, function(err, stdout) {
      if(err) {
        done(err);
        return;
      }
      exec('grunt less', opts, function(e, out){
        if(e) {
          done(e);
          return;
        }
        assert.fileContent('app/styles/style.css', /h1/);
        done();
      });
    });
  });
});
