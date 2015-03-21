
var FTPFilter = require('./ftp_filter');
var urls = require('./urls');
var sortByTime = require('./sorting');
var filtering = require('./filtering');

var filterByOS = filtering.byOS;
var filterByProduct = filtering.byProduct;

var BRANCH_MAPPING = {
  aurora: 'mozilla-aurora',
  nightly: 'mozilla-central'
};

/**
Filters a list of ftp.ls results by operating system.

@param {Object} options for filtering.
@param {Object} options.os like "mac" or win32
@param {Array} list of options to filter.
@return {Null|String} null or name of file.
*/
function filterItems(options, list) {
  var choices = list.
    filter(filterByOS.bind(null, options.os)).
    filter(filterByProduct.bind(null, options.product)).
    sort(sortByTime);

  if (!choices.length)
    return null;

  return choices[0].name;
}

function filter(options, list) {
  var product = BRANCH_MAPPING[options.branch] + "-debug";
  var choices = list.
    filter(filterByProduct.bind(null, product)).
    sort(sortByTime);

  if (!choices.length)
    return null;

  return choices[0].name;
}

function locate(options, callback) {
  // we have some special cases for common names
  // for firefox. We also allow the direct path to the folder for uncommon cases
  // like the weird stuff in b2g.
  options.branch = options.branch || "nightly";

  // construct a base url
  var path = urls.ftpPath(
    options.product,
    options.branch,
    '/'
  );

  // verify it actually exists and return path
  var ftpFilter = new FTPFilter(options);

  ftpFilter.locate(path, filter, function(err, path) {
    ftpFilter.close();

    if (err) {
      return callback(err);
    }

    var ftpFilter2 = new FTPFilter(options);
    ftpFilter2.locate(path + "/", filterItems, function(err, path) {
      ftpFilter2.close();

      if (err) {
        return callback(err);
      }

      callback(null, urls.httpUrl(options.host, path));
    });
  });
}

module.exports = locate;
