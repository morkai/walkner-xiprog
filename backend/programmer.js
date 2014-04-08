// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-xiprog project <http://lukasz.walukiewicz.eu/p/walkner-xiprog>

'use strict';

var config = require('./config');
var scripts = require('./scripts');

app.program = function(nc, done)
{
  if (app.state === 'program')
  {
    return done(new Error("programowanie just już wykonywane"));
  }

  if (!/^[0-9]{12}$/.test(nc))
  {
    return done(new Error("nieprawidłowy kod 12NC"));
  }

  var directory = config.csvProfilesPath;
  var file = nc + '.csv';

  scripts.loadProfile(directory, file, function(err, inputProfile)
  {
    if (err)
    {
      return done(err);
    }

    var historyEntry = app.historyEntry = {
      startedAt: Date.now(),
      finishedAt: 0,
      nc: nc,
      error: null,
      inputProfile: inputProfile,
      outputProfile: null
    };

    var query = "INSERT INTO history (startedAt, nc, inputProfile) "
      + "VALUES(?, ?, ?)";
    var params = [
      historyEntry.startedAt,
      historyEntry.nc,
      historyEntry.inputProfile
    ];

    app.db.run(query, params, function(err)
    {
      if (err)
      {
        return done(err);
      }

      app.db.all("SELECT last_insert_rowid() AS id", function(err, rows)
      {
        if (err)
        {
          return done(err);
        }

        historyEntry.id = rows[0].id;

        app.applyDateTimeStrings(historyEntry, historyEntry.startedAt);

        done(null);

        app.changeState('program');

        app.log("Programming nc=%s...", nc);

        tryToProgram(function(err, outputProfile)
        {
          if (!err)
          {
            var diff = compareProfiles(inputProfile, outputProfile);

            if (diff.length > 0)
            {
              err = new Error(
                "odczytany profil różni się od profilu załadowanego"
              );
            }
          }

          historyEntry.outputProfile = outputProfile;

          if (err)
          {
            app.log("Failed to program nc=%s", nc);

            historyEntry.error = err.message;
          }
          else
          {
            app.log("Programmed nc=%s", nc);
          }

          saveCurrentHistoryEntry();

          scripts.focusWindow(function()
          {
            app.changeState(err ? 'failure' : 'success');
          });
        });
      });
    });
  });
};

/**
 * @private
 * @param {function(boolean, string)} done
 */
function tryToProgram(done)
{
  scripts.program(30000, function(err)
  {
    if (err)
    {
      return done(err, null);
    }

    scripts.read(15000, function(err)
    {
      if (err)
      {
        return done(err, null);
      }

      scripts.saveProfile(done);
    });
  });
}

/**
 * @private
 */
function saveCurrentHistoryEntry()
{
  var historyEntry = app.historyEntry;

  historyEntry.finishedAt = Date.now();

  var query = "UPDATE history SET finishedAt=?, error=?, outputProfile=? "
    + "WHERE rowid=?";
  var data = [
    historyEntry.finishedAt,
    historyEntry.error,
    historyEntry.outputProfile,
    historyEntry.id
  ];

  app.db.run(query, data, function(err)
  {
    if (err)
    {
      app.log("Failed to save a history entry: %s", err.message);
    }
    else
    {
      app.historyEntries.push(historyEntry);

      if (app.historyEntries.length > 20)
      {
        app.historyEntries.shift();
      }
    }
  });
}

/**
 * @private
 * @param {string} inputProfile
 * @param {string} outputProfile
 * @returns {Array.<string>}
 */
function compareProfiles(inputProfile, outputProfile)
{
  /*jshint maxstatements:31*/

  var input = parseProfileData(inputProfile);
  var inputKeys = Object.keys(input);
  var output = parseProfileData(outputProfile);

  var keysToCheck = [
    'AOC_CHECKBOX',
    'MODTEMP_CHECKBOX',
    'STARTFADEUP_CHECKBOX',
    'OLI_CHECKBOX',
    'CLO_SETWORKINGHOURS_CHECKBOX',
    'CLOPROFILE_CHECKBOX',
    'DIMINTERFACE_CHECKBOX'
  ];

  if (input.AOC_CHECKBOX === '1')
  {
    keysToCheck.push('AOC_PGM_OR_RSET');

    if (input.AOC_PGM_OR_RSET === '1')
    {
      keysToCheck.push('AOC_PGM_VALUE');
    }
  }

  if (input.MODTEMP_CHECKBOX === '1')
  {
    keysToCheck.push('MODTEMP_SELECTION');

    if (input.MODTEMP_SELECTION === '1')
    {
      keysToCheck.push(
        'MODTEMP_NTC_SELECTION_INDEX',
        'MODTEMP_NTC_WARN',
        'MODTEMP_NTC_MAX',
        'MODTEMP_NTC_MINDIMLEVEL'
      );
    }
  }

  if (input.STARTFADEUP_CHECKBOX === '1')
  {
    keysToCheck.push('STARTFADEUP_TIME_VALUE');
  }

  if (input.OLI_CHECKBOX === '1')
  {
    keysToCheck.push('OLI_SELECTION');

    if (input.OLI_SELECTION === '1')
    {
      keysToCheck.push('OLI_ACTIVATION_TIME');
    }
  }

  if (input.CLO_SETWORKINGHOURS_CHECKBOX === '1')
  {
    keysToCheck.push('CLO_SETWORKINGHOURS_VALUE');
  }

  if (input.CLOPROFILE_CHECKBOX === '1')
  {
    keysToCheck.push('CLOPROFILE_SELECTION');

    if (input.CLOPROFILE_SELECTION === '1')
    {
      keysToCheck.push.apply(keysToCheck, inputKeys.filter(function(key)
      {
        return (/^CLOPROFILE_(PERCENT|WORKINGHOURS)_[0-9]+$/).test(key);
      }));
    }
  }

  if (input.DIMINTERFACE_CHECKBOX === '1')
  {
    keysToCheck.push('DIMINTERFACE_SELECTION');

    switch (input.DIMINTERFACE_SELECTION)
    {
    // DALI
    case '0':
      keysToCheck.push('DALI_LINEAR_LOG_DIMMING_SELECTION');
      break;

    // 1-10 V
    case '1':
      keysToCheck.push('ZERO2TEN_MINDIMLEVEL');
      break;

    // ID
    case '2':
      keysToCheck.push('CHRONODIM_ENABLE');

      // Time Based
      if (input.CHRONODIM_ENABLE === '1')
      {
        keysToCheck.push.apply(keysToCheck, inputKeys.filter(function(key)
        {
          return (/^CHRONODIM_SCENESEQUENCER_LEVEL[0-9]+_[A-Z]+$/).test(key);
        }));
      }
      // Classic
      else
      {
        keysToCheck.push(
          'PROFILE_DYNADIM_MIDPOINTSHIFT',
          'PROFILE_DYNADIM_LOCATION_INDEX',
          'DYNADIM_OVERRIDE_SELECTION'
        );

        keysToCheck.push.apply(keysToCheck, inputKeys.filter(function(key)
        {
          return (/^DYNADIM_SCENESEQUENCER_LEVEL[0-9]+_[A-Z]+$/).test(key);
        }));
      }
      break;

    // No dimming
    case '3':
      break;

    // AmpDim
    case '4':
      keysToCheck.push(
        'SINEDIM_STARTVOLTAGE',
        'SINEDIM_STARTPERCENT',
        'SINEDIM_STOPVOLTAGE',
        'SINEDIM_STOPPERCENT'
      );
      break;
    }
  }

  return checkProfileKeys(input, output, keysToCheck);
}

/**
 * @private
 * @param {string} profile
 * @returns {object.<string, string>}
 */
function parseProfileData(profile)
{
  var profileData = {};

  String(profile).split('\n').map(function(line)
  {
    line = line.trim();

    if (line.length === 0)
    {
      return;
    }

    var commaPos = line.indexOf(',');
    var key;
    var value;

    if (commaPos === -1)
    {
      key = line;
      value = '';
    }
    else
    {
      key = line.substr(0, commaPos).trim();
      value = line.substr(commaPos + 1).trim();
    }

    if (key === 'PROFILE_NOTES')
    {
      return;
    }

    profileData[key] = value;
  });

  return profileData;
}

/**
 * @private
 * @param {object.<string, string>} input
 * @param {object.<string, string>} output
 * @param {Array.<string>} keysToCheck
 */
function checkProfileKeys(input, output, keysToCheck)
{
  var diff = [];

  keysToCheck.forEach(function(key)
  {
    if (output[key] !== input[key])
    {
      diff.push(key);
    }
  });

  return diff;
}
