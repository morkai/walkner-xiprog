'use strict';

var exec = require('./helpers').exec;
var config = require('../config');

module.exports = function(done)
{
  exec('save-profile.exe', [config.saveLoadDelay], done);
};
