// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-xiprog project <http://lukasz.walukiewicz.eu/p/walkner-xiprog>

'use strict';

app.io.sockets.on('connection', function(socket)
{
  socket.on('program', function(nc, cb)
  {
    app.program(nc, function(err)
    {
      if (typeof cb === 'function')
      {
        cb(err ? {message: err.message} : null);
      }
    });
  });
});
