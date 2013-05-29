'use strict';

var exec = require('./helpers').exec;
var config = require('../config');

module.exports = function(directory, file, done)
{
  exec('load-profile.exe', [directory, file, config.saveLoadDelay], done);
};
