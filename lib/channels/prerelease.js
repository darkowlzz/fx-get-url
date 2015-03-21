var ftpFind = require('../prerelease_filter');
var ftpDebugFind = require('../prerelease_debug_filter');

/**
Channel handler for the firefox "release" branch this is not used
for b2g as we don't have a formal versioned release channel there

@param {Object} options for release (see lib/options)
@param {Function} [Error, String url].
*/
function locate(options, callback) {
  if (options.debug) {
    ftpDebugFind(options, callback);
  }
  else {
    ftpFind(options, callback);
  }
}

module.exports = locate;

