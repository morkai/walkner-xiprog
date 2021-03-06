// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-xiprog project <http://lukasz.walukiewicz.eu/p/walkner-xiprog>

'use strict';

var exec = require('./helpers').exec;
var config = require('../config');

module.exports = function(done)
{
  exec('save-profile.exe', [config.saveLoadDelay], done);
};
