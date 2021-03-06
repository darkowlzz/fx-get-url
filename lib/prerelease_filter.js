
var FTPFilter = require('./ftp_filter');
var urls = require('./urls');
var sortByTime = require('./sorting');
var filtering = require('./filtering');

var filterByOS = filtering.byOS;
var filterByProduct = filtering.byProduct;

var BRANCH_MAPPING = {
  aurora: 'nightly/latest-mozilla-aurora',
  'mozilla-central': 'nightly/latest-mozilla-central',
  // alias for mozilla-central
  nightly: 'nightly/latest-mozilla-central'
};

/**
Filters a list of ftp.ls results by operating system.

@param {Object} options for filtering.
@param {Object} options.os like "mac" or win32
@param {Array} list of options to filter.
@return {Null|String} null or name of file.
*/
function filter(options, list) {
  var choices = list.
    filter(filterByOS.bind(null, options.os)).
    filter(filterByProduct.bind(null, options.product)).
    sort(sortByTime);

  if (!choices.length)
    return null;

  return choices[0].name;
}

function locate(options, callback) {
  // we have some special cases for common names
  // for firefox. We also allow the direct path to the folder for uncommon cases
  // like the weird stuff in b2g.
  var branch = BRANCH_MAPPING[options.branch] || options.branch;

  // default branch is nightly
  if (!branch) branch = BRANCH_MAPPING.nightly;

  // construct a base url
  var path = urls.ftpPath(
    options.product,
    branch,
    '/'
  );

  // verify it actually exists and return path
  var ftpFilter = new FTPFilter(options);

  ftpFilter.locate(path, filter, function(err, path) {
    ftpFilter.close();
    if (err) {
      return callback(err);
    }
    callback(null, urls.httpUrl(options.host, path));
  });
}

module.exports = locate;
