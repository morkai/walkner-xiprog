// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under CC BY-NC-SA 4.0 <http://creativecommons.org/licenses/by-nc-sa/4.0/>.
// Part of the walkner-xiprog project <http://lukasz.walukiewicz.eu/p/walkner-xiprog>

'use strict';

var spawn = require('child_process').spawn;

var BIN_DIR = __dirname + '/../../bin/scripts';
//var BIN_DIR = __dirname;

var ERRORS = {
  ERR_INVALID_PROFILE_PATH: "nieprawidłowa ścieżka do profilu",
  ERR_WIN_MISSING: "nie znaleziono okna programatora",
  ERR_WIN_NOT_ACTIVATED: "nie udało się aktywować okna programatora",
  ERR_LOAD_PROFILE_WIN_MISSING: "nie znaleziono okna ładowania profilu",
  ERR_LOAD_PROFILE_WIN_NOT_ACTIVATED:
    "nie udało się aktywować okna ładowania profilu",
  ERR_LOADING_FAILED: "ładowanie profilu nie powiodło się",
  ERR_SAVE_PROFILE_WIN_MISSING: "nie znaleziono okna zapisywania profilu",
  ERR_SAVE_PROFILE_WIN_NOT_ACTIVATED:
    "nie udało się aktywować okna zapisywania profilu",
  ERR_SAVING_FAILED: "zapisywanie profilu nie powiodło się.",
  ERR_PORT_NOT_AVAILABLE: "wybrany port COM jest niedostępny",
  ERR_COMMUNICATION_ERROR: "błąd komunikacji",
  ERR_INCOMPATIBLE_VERSION: "niekompatybilna wersja",
  ERR_PROGRAMMING_TIMEOUT: "przekroczenie czasu oczekiwania",
  ERR_READING_TIMEOUT: "przekroczenie czasu oczekiwania"
};

/**
 * @param {string} scriptExe
 * @param {Array.<string>} args
 * @param {function(Error|null, string|null)} done
 */
exports.exec = function(scriptExe, args, done)
{
  var scriptProcess = spawn(BIN_DIR + '/' + scriptExe, args);
  var stderr = '';
  var stdout = '';

  scriptProcess.stderr.setEncoding('utf8');
  scriptProcess.stderr.on('data', function(data)
  {
    stderr += data;
  });

  scriptProcess.stdout.setEncoding('utf8');
  scriptProcess.stdout.on('data', function(data)
  {
    stdout += data;
  });

  scriptProcess.on('error', function(err)
  {
    if (done.handled)
    {
      return;
    }

    done.handled = true;
    done(err, null);
  });

  scriptProcess.on('close', function(code)
  {
    if (done.handled)
    {
      return;
    }

    done.handled = true;

    if (code === 0)
    {
      done(null, stdout);
    }
    else
    {
      if (stderr.substr(0, 4) === 'ERR_'
        && typeof ERRORS[stderr] !== 'undefined')
      {
        stderr = ERRORS[stderr];
      }

      done(new Error(stderr), null);
    }
  });
};

/**
 * @param {string} action
 * @param {string} resultsStr
 * @param {function(Error|null, object.<string, number>|null)} done
 */
exports.handleResultsString = function(action, resultsStr, done)
{
  var resultsArr = resultsStr
    .split(',')
    .map(function(str) { return str.trim(); });

  var length = resultsArr.length;

  if (length === 0)
  {
    return done(new Error(
      action === 'read'
        ? "brak wyników odczytywania"
        : "brak wyników programowania"
    ));
  }

  if (length % 2 !== 0)
  {
    return done(new Error(
      action === 'read'
        ? "niepoprawny wynik odczytywania"
        : "niepoprawny wynik programowania"
    ));
  }

  var failures = [];
  var resultsObj = {};

  for (var i = 0, j = 1; j < length; i += 2, j += 2)
  {
    var setting = resultsArr[i];
    var result = Number(resultsArr[j]);

    resultsObj[setting] = result;

    if (result !== 1)
    {
      failures.push(setting);
    }
  }

  if (failures.length > 0)
  {
    failures = failures.join(', ');

    return done(new Error(
      action === 'read'
        ? ("niepomyślne odczytywanie opcji: " + failures)
        : ("niepomyślne programowanie opcji: " + failures)
    ));
  }

  return done(null, resultsObj);
};
