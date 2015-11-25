function runbower() {
  var bower = grunt.file.readJSON('bower.json');
  var packages = Object.keys(bower.dependencies);
  if(packages.length) {
    grunt.tasks.run(['wiredep']);
  }
}
