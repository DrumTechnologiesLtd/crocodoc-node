// Defines the details for the RESTful Crocodoc API v2,
// as well as providing some helper methods for creating URIs to resources
// and submitting the request.
//

// Core node module dependencies
//
var inspect = require('util').inspect;
var querystring = require('querystring');
var url = require('url');
var path = require('path');

// 3rd party library dependencies
//
var request = require('request');
var FormData = require('form-data');

// Internal dependencies
//
var CrocodocError = require('./error');
var ErrorTypes = CrocodocError.errors; // aliasing for brevity

// private helpers
//
function normaliseQuery(query, apiToken) {
  var nq;
  switch (typeof query) {
    case 'string':
      // parse out the querystring into a hash of the query params
      nq = querystring.parse(query);
      break;
    case 'object':
      // shallow clone the query hash, so we can add the api token without mutating the original
      nq = (function(o){
        var c = {};
        for (var k in o) {
          c[k] = o[k];
        }
        return c;
      })(query);
      break;
    default:
      nq = {};
  }
  if (apiToken) {
    nq.token = apiToken;
  }
  return nq;
}

function wrappedCallback(cb) {
  cb = (typeof cb === 'function') ? cb : function(){};
  return function(e, r, b) {
    var body;
    if (!e && r && r.headers && r.headers['content-type'] === 'application/json') {
      try {
        body = JSON.parse(b);
      }
      catch (e) {}
    }
    else if (typeof b === 'object') {
      body = b;
    }
    body = body || {body: b};
    cb(e, r, body);
  };
}

function validateCommonArgs(apiToken, resource, cb) {
  if (!cb) {
    throw new CrocodocError(ErrorTypes.INVALID_USE, 'No callback supplied');
  }
  if (typeof cb !== 'function') {
    throw new CrocodocError(ErrorTypes.INVALID_TYPE, 'Supplied callback is not a function: '+(typeof cb)+' ['+inspect(cb)+']');
  }
  if (typeof apiToken !== 'string') {
    throw new CrocodocError(ErrorTypes.INVALID_TYPE, 'Supplied API Token is not a string: '+(typeof apiToken)+' ['+inspect(apiToken)+']');
  }
  if (apiToken.length <= 0) {
    throw new CrocodocError(ErrorTypes.INVALID_API_TOKEN, 'Supplied API Token "'+apiToken+'" is too short');
  }
  if (typeof resource !== 'string') {
    throw new CrocodocError(ErrorTypes.INVALID_TYPE, 'Supplied resource is not a string: '+(typeof resource)+' ['+inspect(resource)+']');
  }
  if (resource.length <= 0) {
    throw new CrocodocError(ErrorTypes.INVALID_RESOURCE, 'Supplied resource "'+resource+'" is too short');
  }
}

function stringFromStream(stream, callback) {
  var chunks = [];
  var bodyLen = 0;
  stream.on('data', function (chunk) {
    chunks.push(chunk);
    bodyLen += chunk.length;
  });
  stream.on('end', function () {
    var body;
    if (chunks.length && Buffer.isBuffer(chunks[0])) {
      body = new Buffer(bodyLen);
      var i = 0;
      chunks.forEach(function (chunk) {
        chunk.copy(body, i, 0, chunk.length);
        i += chunk.length;
      });
      body = body.toString('utf8');
    }
    else if (chunks.length) {
      body = chunks.join('');
    }
    callback(body);
  });
}

// Exposed interface
//
var API = module.exports = {
  // Base definitions of the RESTful API
  //
  base: {
    protocol: 'https',
    host:     'crocodoc.com',
    pathname: '/api/v2'
  },

  uriString: function(resource, query) {
    if (typeof resource !== 'string') {
      throw new CrocodocError(ErrorTypes.INVALID_TYPE, 'Supplied resource is not a string: '+(typeof resource)+' ['+inspect(resource)+']');
    }
    if (resource.length <= 0) {
      throw new CrocodocError(ErrorTypes.INVALID_RESOURCE, 'Supplied resource "'+resource+'" is too short');
    }

    return url.format({
      protocol: API.base.protocol,
      host: API.base.host,
      pathname: path.join(API.base.pathname, resource),
      query: normaliseQuery(query)
    });
  },

  // get(apiToken, resource, [{query: query, successStream: writeStream},] callback)
  get: function(apiToken, resource) {
    if (arguments.length < 3 || arguments.length > 4) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+__filename+'.get(): '+arguments.length);
    }
    var cb = arguments[arguments.length - 1];
    validateCommonArgs(apiToken, resource, cb);

    var options = (arguments.length === 4) ? arguments[2] : {};
    var query = normaliseQuery(options.query, apiToken);
    var successStream = options.successStream;

    var _callback = wrappedCallback(cb);

    if (successStream) {
      var req = request.get(API.uriString(resource, query));
      req.on('error', function(err) {
        _callback(err);
      });
      req.on('response', function(response) {
        if (response.statusCode === 200) {
          response.pipe(successStream);
          successStream.on('close', function() {
             delete query.token;
            _callback(null, response, query);
          });
        }
        else {
          stringFromStream(response, function(body) {
            _callback(null, response, body);
          });
        }
      });
    }
    else {
      return request.get(API.uriString(resource, query), _callback);
    }

  },
  // post(apiToken, resource, [{query: query, encodingOptions: encodingOptions},] callback)
  post: function(apiToken, resource) {
    if (arguments.length < 3 || arguments.length > 4) {
      throw new CrocodocError(ErrorTypes.INVALID_USE, 'Incorrect number of arguments passed to '+__filename+'.post(): '+arguments.length);
    }
    var cb = arguments[arguments.length - 1];
    validateCommonArgs(apiToken, resource, cb);

    var options = (arguments.length === 4) ? arguments[2] : {};

    var query = normaliseQuery(options.query, apiToken);
    var encodingOptions = options.encodingOptions;

    var _callback = wrappedCallback(cb);

    if (encodingOptions.query) {
      return request.post(API.uriString(resource, query), _callback);
    }
    if (encodingOptions.multipart) {
      var form;
      var req;
      if (encodingOptions.chunked) {
        req = request.post(API.uriString(resource), _callback);
        form = req.form();
      }
      else {
        form = new FormData();
      }

      for (var k in query) {
        form.append(k, query[k]);
      }

      if (!encodingOptions.chunked) {
        req = form.submit(API.uriString(resource), function(err, res){
          stringFromStream(res, function(body) {
            _callback(err, res, body);
          });
        });
      }
      return req;
    }
    return request.post({
      uri: API.uriString(resource),
      form: query
    }, _callback);
  }
};
