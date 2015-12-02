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
      .withArguments(['skip-install'])
      .withOptions({ less: true })
      .withPrompts(prompts)
      .on('end', function(){
        done();
      });
  });

  it('should create less folder and files', function() {
    assert(['less', 'less/main.less', 'less/h1.less']);

  });

  // it('should include less grunt packages', function() {
  //   expect(testGlobal.dir).to.not.be.undefined;
  //   expect(testGlobal.dir).to.be.a('string');
  //   var file = path.join(testGlobal.dir, 'package.json');
  //   var pkg = fetchJson(file);
  //   expect(pkg.devDependencies).to.contain.keys('grunt-contrib-less');
  // });

  it('should have grunt watch task', function(){
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
    // expect(generator.options['less']).to.be.true;
    // expect(generator.options['skip-install']).to.be.true;
    expect(generator.gruntConfig.watch.less).to.not.be.undefined;
    expect(generator.gruntConfig.watch.less).to.deep.equal(lessObj.less);

  });
});
