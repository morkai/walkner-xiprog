'use strict';

/**
 * Port on which the HTTP server should listen for requests.
 *
 * @type {number}
 */
exports.httpPort = 1337;

/**
 * Path to a directory with the CSV profile files.
 *
 * @type {string}
 */
exports.csvProfilesPath
  = 'C:/Program Files (x86)/Xitanium Outdoor Driver Programmer';

/**
 * Additional delay that should be added to the standard delay of the load/save
 * profile AutoIt scripts (in ms).
 *
 * @type {number}
 */
exports.saveLoadDelay = 0;

/**
 * CSV options used when exporting the history.
 *
 * Available options are:
 *
 *   - `delimiter` - a character to use as the field delimiter.
 *   - `quote` - a character to use for the value quoting.
 *   - `escape` - a character to use for escaping special characters.
 *   - `trim` - whether to ignore leading and trailing whitespace characters.
 *
 * @type {object}
 */
exports.csvOptions = {
  delimiter: ';',
  quote: '"',
  escape: '"',
  trim: true
};
