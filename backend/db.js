'use strict';

var sqlite3 = require('sqlite3');

app.db = new sqlite3.Database(__dirname + '/../data/db.sqlite3', function(err)
{
  if (err)
  {
    console.error(err);
    process.exit(1);
  }

  var db = this;

  db.serialize(function()
  {
    db.run(
      "CREATE TABLE IF NOT EXISTS history (startedAt INT, "
        + "finishedAt INT, nc TEXT, error TEXT, "
        + "inputProfile TEXT, outputProfile TEXT)"
    );

    db.run("DELETE FROM history WHERE finishedAt IS NULL");
  });
});
