// Sets up a *global* framework for testing.
//
// This is included in the mocha.opts file as a --require,
// so that individual test specs don't have to explicitly require the framework.
var _ = require('underscore');

var crocodocDetails = (function(){
  // if the crocodoc.js exists, use the values in that
  // otherwise use default (dummy) ones.
  try { return require('./crocodoc-details'); }
  catch (e) { return null; }
})() || {token: 'DEFAULT_API_TOKEN'};

var DocumentAPI = require('api/document');
var document = new DocumentAPI(crocodocDetails.token);

var tempUuid = {
  uuids: [],
  add: function(uuid) {
    tempUuid.uuids.push(uuid);
  },
  remove: function(uuid) {
    var i;
    while((i = tempUuid.uuids.indexOf(uuid)) >= 0 ) {
      tempUuid.uuids.splice(i, 1);
    }
  },
  purge: function (cb, failed) {
    failed = failed || [];
    cb = cb || function(){};
    if (tempUuid.uuids && tempUuid.uuids.length > 0) {
      document.remove(tempUuid.uuids[0], function(e, r, b) {
        if (b === false || b.error) {
          failed.push(tempUuid.uuids[0]);
        }
        tempUuid.remove(tempUuid.uuids[0]);
        tempUuid.purge(cb, failed);
      });
    }
    else {
      cb(null, failed);
    }
  },
  fromUrl: function(url, cb) {
    cb = cb || function(){};
    document.uploadUrl(url, function(e, r, b) {
      if (!e && b && b.uuid) {
        tempUuid.add(b.uuid);
      }
      cb(e, r, b);
    });
  },
  fromFile: function(filepath, cb) {
    cb = cb || function(){};
    document.uploadFile(filepath, function(e, r, b) {
      if (!e && b && b.uuid) {
        tempUuid.add(b.uuid);
      }
      cb(e, r, b);
    });
  },
  waitFor: function(uuid, cb) {
    cb = cb || function(){};
    document.poll(uuid, cb);
  }
};

function commonChecks(it, e, r, b) {
  it('should get a falsey error', function() {
    framework.assert(!e(), 'Expected error to be falsey, not: '+e());
  });
  it('should get a truthy response', function() {
    framework.assert(r(), 'Expected response to be truthy, not: '+r());
  });
  it('should have truthy response headers', function() {
    framework.assert(r().headers, 'Expected response headers to be truthy, not: '+r().headers);
  });
  it('should get a truthy body', function() {
    framework.assert(b(), 'Expected body to be truthy, not: '+b());
  });
}

framework = module.exports = {
  assert:       require('assert'),
  url:          require('url'),
  path:         require('path'),
  qs:           require('querystring'),
  inspect:      require('util').inspect,
  exec:         require('child_process').exec,
  fsUtils:      require('api/fsUtils'),
  throwsError:  function(fn, message) {
    if (typeof fn !== 'function') {
      throw new Error('Invalid use of framework: Expected a function to be supplied');
    }
    message = message || 'Expected an error to be thrown';
    var err;
    try {
      fn();
    }
    catch (e) {
      err = e;
    }
    framework.assert(err, message);
  },
  isArray: _.isArray,
  tempUuid: tempUuid,
  tempFile: function(fname) {
    return framework.path.resolve('test/results', fname);
  },
  timeouts: {
    poll: 40000,
    response: 5000
  },
  restTests: function(it) {
    return {
      _200Checks: function(e, r, b) {
        commonChecks(it, e, r, b);
        it('should get a 200 OK response', function() {
          framework.assert(r().statusCode === 200, 'Expected response status code to be 200, not: '+r().statusCode);
        });
      },
      _400Checks: function(e, r, b) {
        commonChecks(it, e, r, b);
        it('should get a 400 response', function() {
          framework.assert(r().statusCode === 400, 'Expected response status code to be 400, not: '+r().statusCode);
        });
      },
      _JsonContentChecks: function(e, r, b, notJson) {
        if (notJson) {
          it('should have a content-type response header which is not application/json', function() {
            var contentType = r().headers['content-type'];
            framework.assert((typeof contentType === 'string') && contentType.toLowerCase() !== 'application/json', 'Expected content type not to be application/json');
          });
        }
        else {
          it('should have a content-type response header of application/json', function() {
            var contentType = r().headers['content-type'];
            framework.assert((typeof contentType === 'string') && contentType.toLowerCase() === 'application/json', 'Expected content type to be application/json, not: '+contentType);
          });
        }
      }
    };
  },
  values: {
    invalidParamList: [
      { name: 'undefined',      value: undefined      },
      { name: 'null',           value: null           },
      { name: 'number',         value: 1              },
      { name: 'boolean, true',  value: true           },
      { name: 'boolean, false', value: false          },
      { name: 'object',         value: {}             },
      { name: 'function',       value: function (){}  },
      { name: 'empty array',    value: []             },
      { name: 'empty string',   value: ''             }
    ],
  },
  crocodoc: crocodocDetails
};

