// Core node module dependencies
//

// 3rd party library dependencies
//
var _ = require('underscore');

// Internal dependencies
//
var CrocodocError = require('./error');
var ErrorTypes = CrocodocError.errors; // aliasing for brevity

var CrocodocAPI = require('./crocodoc');

var DownloadAPI = module.exports = CrocodocAPI.extend({
  constructor: function DownloadAPI() {
    CrocodocAPI.apply(this, arguments);

    _.bindAll(this, 'document', 'thumbnail', 'text');
  },

  // document(uuid, [options,] writeableStream,  callback);
  document: function(uuid) {
    // Validate params
    if (typeof uuid !== 'string' || uuid.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.document() was not passed a valid uuid string: '+(typeof uuid));
    }
    if (arguments.length < 3 || arguments.length > 4) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+this.constructor.name+'.document(): '+arguments.length);
    }
    var callback = arguments[arguments.length - 1];
    var stream = arguments[arguments.length - 2];

    var options = (arguments.length === 4) ? arguments[1] : {};

    options.uuid = uuid;

    return this.get(DownloadAPI.resource.document, {query: options, successStream: stream}, callback);
  },

  // thumbnail(uuid, [size,] writeableStream, callback);
  thumbnail: function(uuid) {
    // Validate params
    if (typeof uuid !== 'string' || uuid.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.thumbnail was not passed a valid uuid string: '+(typeof uuid));
    }
    if (arguments.length < 3 || arguments.length > 4) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+this.constructor.name+'.thumbnail(): '+arguments.length);
    }
    var callback = arguments[arguments.length - 1];
    var stream = arguments[arguments.length - 2];

    var size = (arguments.length === 4) ? arguments[1] : undefined;
    if (size && typeof size !== 'string' || size.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.thumbnail() was not passed a valid size string: '+(typeof uuid));
    }
    var options = {
      uuid: uuid,
      size: size
    };

    return this.get(DownloadAPI.resource.thumbnail, {query: options, successStream: stream}, callback);
  },

  // text(uuid, writeableStream, callback);
  text: function(uuid, stream, callback) {
    // Validate params
    if (typeof uuid !== 'string' || uuid.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.thumbnail was not passed a valid uuid string: '+(typeof uuid));
    }
    if (arguments.length !== 3) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+this.constructor.name+'.text(): '+arguments.length);
    }

    return this.get(DownloadAPI.resource.text, {query: {uuid: uuid}, successStream: stream}, callback);
  },

}, {
  resource: {
    document:   'download/document',
    thumbnail:  'download/thumbnail',
    text:       'download/text'
  }
});

