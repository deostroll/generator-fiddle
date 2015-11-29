/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var yeoman = require('yeoman-generator')
var helpers = yeoman.test, assert = yeoman.assert;
var fs = require('fs');
var expect = require('chai').expect;

describe('fiddle generator', function () {
  var prompts = {
    workFolder: 'temp',
    fiddleDesc: 'mocha test'
  };

  beforeEach(function(done) {
      this.app = helpers.run(path.join(__dirname, '../app'))
        .inTmpDir(function(dir, err) {
          if(err) { done(err); return; }
          this.tempDir = dir;
          // console.log('directory:', dir, typeof(dir));
        }.bind(this))
        .withArguments(['skip-install'])
        .withPrompts(prompts)
        .on('end', function(){
          done();
        });
  }.bind(this));

  it('creates expected files', function (done) {
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
      done();
  }.bind(this));

  it('modifies bower.json to reflect the work folder', function(done){
    var tempDir = this.tempDir;
    expect(tempDir).to.not.equal(undefined);
    var bowerFile = path.join(tempDir, 'bower.json');
    var bower = JSON.parse(fs.readFileSync(bowerFile, 'utf8'));
    expect(bower.name).to.equal(prompts.workFolder);
    done();
  }.bind(this));

  it('modifies package.json to reflect the work folder', function(done){
    var tempDir = this.tempDir;
    expect(tempDir).to.not.equal(undefined);
    var pkgFile = path.join(tempDir, 'package.json');
    var pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
    expect(pkg.name).to.equal(prompts.workFolder);
    done();
  }.bind(this));
});
