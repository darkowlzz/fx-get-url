
LOCALIZER

var SUFFIX_MAP = {
  win32: /\.exe$/,
  mac: /\.dmg$/,
  'linux-i686': /\.tar.bz2$/,
  'linux-x86_64': /\.tar.bz2$/
};

var LOCALIZER = 'localizer';

/**
Require the binary name to begin with the product name.  This is to deal with
situations where a directory may contain both "b2g" and "firefox" builds.

@param {String} product The product name plus any delimiter you also, ex: "b2g-"
@param {Object} item from ftp.ls.
*/
function byProduct(product, item) {
  return (item.name.indexOf(product) >= 0);
}
exports.byProduct = byProduct;

/**
Not all results may be for the OS in the pre-release case.

@param {String} os string see SUFFIX_MAP keys.
@param {Object} item from ftp.ls.
*/
function byOS(os, item) {
  if (!SUFFIX_MAP[os]) {
    throw new Error('invalid operating system type: "' + os + '"');
  }

  var suffix = SUFFIX_MAP[os];
  var name = item.name;

  return (
    // operating system is in the name
    name.indexOf(os) !== -1 &&
    // exclude localizer builds
    name.indexOf(LOCALIZER) === -1 &&
    // ends in correct suffix
    suffix.test(name)
  );
}
exports.byOS = byOS;
