// Core node module dependencies
//
var inspect = require('util').inspect;

// 3rd party library dependencies
//
var inheritance = require('soak');

// Internal dependencies
//
var CrocodocError = require('./error');
var ErrorTypes = CrocodocError.errors; // aliasing for brevity

// Use the v2 definitions for the API.
//
var API = require('./api-v2');

// Extend and export the API
//
// Takes a Crocodoc API Token in its constructor,
// and exposes wrapper methods to the generic API methods which automatically pass in the
// API token.
//
var CrocodocAPI = module.exports = inheritance.inherit(API, {
  constructor: function CrocodocAPI(apiToken) {

    // Validate the constructor arguments
    if (arguments.length !== 1) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+this.constructor.name+' constructor: '+arguments.length);
    }
    if (typeof apiToken !== 'string') {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, 'Supplied API Token is not a string: '+(typeof apiToken)+' ['+inspect(apiToken)+']');
    }
    if (apiToken.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_API_TOKEN, 'Supplied API Token "'+apiToken+'" is too short');
    }
    
    this.uriString = API.uriString;
    
    this.get = function() {
      return API.get.apply(this, Array.prototype.concat.apply([apiToken], arguments));
    };
    this.post = function() {
      return API.post.apply(this, Array.prototype.concat.apply([apiToken], arguments));
    };
  },
}, {
  extend: function (instance, statics) {
    return inheritance.inherit(this, instance, statics);
  },
});
