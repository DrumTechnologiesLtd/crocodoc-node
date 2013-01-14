// Core node module dependencies
//
var fs = require('fs');

// 3rd party library dependencies
//
var _ = require('underscore');

// Internal dependencies
//
var CrocodocError = require('./error');

var fsUtils = require('./fsUtils');

// aliasing for brevity
var ErrorTypes = CrocodocError.errors;
var getPathStats = fsUtils.getPathStats;
var isFile = fsUtils.isFile;
var isReadable = fsUtils.isReadable;

var CrocodocAPI = require('./crocodoc');

var DocumentAPI = module.exports = CrocodocAPI.extend({
  constructor: function DocumentAPI() {
    CrocodocAPI.apply(this, arguments);

    _.bindAll(this, 'status', 'uploadFile', 'uploadUrl', 'remove', 'poll');
  },

  status: function(uuids, callback) {
    // Validate params
    if (typeof uuids === 'string' && uuids.length > 0) {
      uuids = [uuids];
    }
    if (!_.isArray(uuids) || uuids.length <=0 ) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.status was not passed a valid uuid or array of uuids: '+(typeof uuids));
    }

    return this.get(DocumentAPI.resource.status, {query: {uuids: uuids.join(',')}}, callback);
  },

  uploadFile: function(filepath, callback) {
    var readStream;
    // Validate params
    if (typeof filepath !== 'string') {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.uploadFile was not passed a string filepath: '+(typeof filepath));
    }
    if (!isFile(filepath)) {
      throw new CrocodocError(ErrorTypes.FILE_ERROR, this.constructor.name+'.uploadFile, file does not exist or is not a file: "'+filepath+'"');
    }
    if (!isReadable(filepath)) {
      throw new CrocodocError(ErrorTypes.FILE_ERROR, this.constructor.name+'.uploadFile, file is not readable: "'+filepath+'"');
    }

    readStream = fs.createReadStream(filepath);

    return this.post(DocumentAPI.resource.upload, {query: {file: readStream}, encodingOptions: {multipart: true, chunked: false}}, callback);

  },

  uploadUrl: function(fileurl, callback) {
    // Validate params
    if (typeof fileurl !== 'string' || fileurl.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.uploadUrl was not passed a valid url string: '+(typeof fileurl));
    }

    return this.post(DocumentAPI.resource.upload, {query: {url: fileurl}, encodingOptions: {multipart: false, chunked: false}}, callback);

  },

  remove: function(uuid, callback) {
    // Validate params
    if (typeof uuid !== 'string' || uuid.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.remove was not passed a valid uuid string: '+(typeof uuid));
    }

    return this.post(DocumentAPI.resource.remove, {query: {uuid: uuid}, encodingOptions: {multipart: false, chunked: false}}, callback);
  },

  // This is not part of the API, but merely a helper
  //
  poll: function(uuid, callback) {
    if (arguments.length !== 2) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+this.constructor.name+'.poll(): '+arguments.length);
    }
    if (typeof uuid !== 'string' || uuid.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.poll was not passed a valid uuid string: '+(typeof uuid));
    }
    if (typeof callback !== 'function') {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.poll was not passed a valid callback: '+(typeof callback));
    }

    var self = this;
    this.status(uuid, function (e, r, b) {
      var body = (b && b.length && (b.length > 0)) ? b[0] : {error: true};
      var status = (body.status || 'unknown').toLowerCase();

      if (e || body.error || status === 'error' || status === 'done') {
        callback(e, r, body);
      }
      else {
        setTimeout(function() {self.poll(uuid, callback);}, 2000);
      }
    });
  }
}, {
  resource: {
    status: 'document/status',
    upload: 'document/upload',
    remove: 'document/delete'
  }
});

