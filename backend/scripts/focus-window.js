'use strict';

var exec = require('./helpers').exec;

module.exports = function(done)
{
  exec('focus-window.exe', ["Programator Xitanium"], done);
};
