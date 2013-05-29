'use strict';

var helpers = require('./helpers');

module.exports = function(timeout, done)
{
  helpers.exec('program.exe', [timeout], function(err, stdout)
  {
    if (err)
    {
      return done(err);
    }

    return helpers.handleResultsString('program', stdout, done);
  });
};
