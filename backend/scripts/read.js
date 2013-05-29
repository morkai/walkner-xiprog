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
