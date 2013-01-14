// filesystem helper methods
//
var fs = require('fs');
var path = require('path');

var getPathStats = module.exports.getPathStats = function(p) {
  if (typeof p === 'string') {
    try {
      return fs.statSync(p);
    }
    catch (e) {
    }
  }
  return null;
};

var isFile = module.exports.isFile = function(p) {
  var stats = getPathStats(p);
  return stats ? stats.isFile() : false;
};

var isDirectory = module.exports.isDirectory = function(p) {
  var stats = getPathStats(p);
  return stats ? stats.isDirectory() : false;
};

var getFileStats = module.exports.getFileStats = function(p) {
  var stats = getPathStats(p);
  return (stats && stats.isFile()) ? stats : null;
};

var fileSize = module.exports.fileSize = function(p) {
  var stats = getFileStats(p);
  return stats ? stats.size : -1;
};

var mkdir = module.exports.mkdir = function(p) {
  if (!isDirectory(p)) {
    mkdir(path.dirname(p));
    fs.mkdirSync(p);
  }
};

var mkParentDir = module.exports.mkParentDir = function(p) {
  mkdir(path.dirname(p));
};

var isReadable = module.exports.isReadable = function (p) {
  if (isFile(p)) {
    try {
      fs.closeSync(fs.openSync(p, 'r'));
      return true;
    }
    catch (e) {}
  }
  return false;
};

var readStream = module.exports.readStream = function(p) {
  return fs.createReadStream(p);
};

var writeStream = module.exports.writeStream = function(p) {
  return fs.createWriteStream(p);
};
