var connectMiddleware = function(connect) {
  var app = connect();
  var _static = require('./node_modules/grunt-contrib-connect/node_modules/serve-static');
  app.use('/bower_components', _static('../bower_components'));
}
