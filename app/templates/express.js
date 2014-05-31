/* jshint unused:false */

'use strict';

var express = require('express');
var app = express();

app.post('/api/service', function (req, res) {
    // Implement me
});

app.get('/api/service', function (req, res) {
    // Implement me
});

app.use(express.static(__dirname + '/app'));

module.exports = app;