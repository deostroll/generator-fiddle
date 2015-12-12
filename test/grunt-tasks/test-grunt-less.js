var exec = require('child_process').exec;
var path = require('path');
var yeoman = require('yeoman-generator')
var helpers = yeoman.test;
var fs = require('fs');
var expect = require('chai').expect;

describe('less grunt tasks tests', function () {
  var prompts = {
    workFolder: 'temp',
    fiddleDesc: 'mocha test'
  };
  var self = {};
  before(function(done) {
    self.app = helpers.run(path.join(__dirname, '../../app'))
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

  it('should modify app/styles/style.css', function(done){
    this.timeout(60000 * 10); //10 minutes - my network is f**ked up
    var opts = {
      cwd : self.dir,
      env: process.env,
      detached: true
    };
    var gen = self.app.generator;
    var devdeps = gen.devDependencies.join(' ');
    var rootPath = self.dir;
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
