var inheritance = require('soak');

var CE = module.exports = inheritance.inherit(Error, {
  constructor: function CrocodocError(type, message) {
    this.type = type || CE.errors.UNKNOWN_ERROR;
    this.message = this.type + ': '+(message || '');
    Error.call(this, this.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }

}, {
  extend: function (instanceProps, staticProps) {
    return inheritance.inherit(this, instanceProps, staticProps);
  },
  errors: {
    INVALID_ERROR: 'Unknown error',
    INVALID_USE:  'Invalid API use',
    INVALID_TYPE: 'Invalid type',
    INVALID_API_TOKEN: 'Invalid API Token',
    INVALID_RESOURCE: 'Invalid resource',
    FILE_ERROR: 'File error'
  }
});
