// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-xiprog project <http://lukasz.walukiewicz.eu/p/walkner-xiprog>

'use strict';

var helpers = require('./helpers');

module.exports = function(timeout, done)
{
  helpers.exec('read.exe', [timeout], function(err, stdout)
  {
    if (err)
    {
      return done(err);
    }

    return helpers.handleResultsString('read', stdout, done);
  });
};
