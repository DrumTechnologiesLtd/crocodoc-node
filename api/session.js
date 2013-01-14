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

var defaultOptions = {
  editable:       false,
  user:           undefined,  // "id,Name", required if editable is true
  filter:         'all',      // "all" | "none" | "id1,id2,id3"
  admin:          false,
  downloadable:   false,
  copyprotected:  false,
  demo:           false,
  sidebar:        'none'      // "none" | "auto" | "collapse" | "visible"
};

var SessionAPI = module.exports = CrocodocAPI.extend({
  constructor: function SessionAPI() {
    CrocodocAPI.apply(this, arguments);

    _.bindAll(this, 'create');
  },

  // create(uuid, [options,] callback)
  create: function(uuid) {
    // Validate params
    if (typeof uuid !== 'string' || uuid.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, this.constructor.name+'.create was not passed a valid uuid string: '+(typeof uuid));
    }
    if (arguments.length < 2 || arguments.length > 3) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+this.constructor.name+'.create(): '+arguments.length);
    }
    var callback = arguments[arguments.length - 1];
    var options = (arguments.length === 3) ? arguments[1] : {};
    options.uuid = uuid;

    return this.post(SessionAPI.resource.create, {query: options, encodingOptions: {multipart: false, chunked: false}}, callback);

  }
}, {
  resource: {
    create: 'session/create'
  },
  getDefaultOptions: function() {
    // Shallow copy the default options,
    // so that the defaults are kept immutable.
    var o = {};
    for (var k in defaultOptions) {
      o[k] = defaultOptions[k];
    }
    return o;
  }
});

