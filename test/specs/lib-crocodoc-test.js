// Tests for the generic crocodoc API class

var API = require('api/crocodoc');

function commonInstanceMethodTests(testMethod) {
  it('should throw an error with no parameters', function() {
    framework.throwsError(function() {
      testMethod();
    });
  });

  it('should throw an error with a resource only, and no callback', function() {
    framework.throwsError(function() {
      testMethod('some/resource');
    });
  });
  it('should throw an error with a resource only, and a non-function callback', function() {
    framework.throwsError(function() {
      testMethod('some/resource', 'not a function');
    });
  });
  it('should throw errors with invalid resource parameters only, and a callback', function() {
    framework.values.invalidParamList.forEach(function(e) {
      framework.throwsError(function() {
        testMethod(e.value, function(){});
      }, 'Expected an error with a resource param of type '+e.name);
    });
  });

  it('should throw an error with a resource, options, and no callback', function() {
    framework.throwsError(function() {
      testMethod('some/resource', {});
    });
  });
  it('should throw an error with a resource, options, and a non-function callback', function() {
    framework.throwsError(function() {
      testMethod('some/resource', {}, 'not a function');
    });
  });
  it('should throw errors with invalid resource parameters, options, and a callback', function() {
    framework.values.invalidParamList.forEach(function(e) {
      framework.throwsError(function() {
        testMethod(e.value, {}, function(){});
      }, 'Expected an error with a resource param of type '+e.name);
    });
  });

  it('should throw an error with a resource, options, an extra parameter, and a callback', function() {
    framework.throwsError(function() {
      testMethod('some/resource', {}, 'extra', function(){});
    });
  });
}

describe('Crocodoc API: Client Library: base', function() {
  describe('constructor', function(){
    it('should throw an error with no API Token', function() {
      framework.throwsError(function(){new API();});
    });
    it('should throw an error if too many args are passed', function() {
      framework.throwsError(function(){new API(framework.crocodoc.token, 1);});
    });
    it('should throw errors with invalid API Token parameters', function() {
      framework.values.invalidParamList.forEach(function(e) {
        framework.throwsError(function() {
          new API(e.value);
        }, 'Expected an error with an API Token of type '+e.name);
      });
    });
    it('should NOT throw an error with a non-empty API Token string', function(){
      new API(framework.crocodoc.token);
    });
  });
  describe('instance', function() {
    var instance = new API(framework.crocodoc.token);

    it('should have a uriString function', function() {
      framework.assert(typeof instance.uriString === 'function');
    });
    it('should have a get function', function() {
      framework.assert(typeof instance.get === 'function');
    });
    it('should have a post function', function() {
      framework.assert(typeof instance.post === 'function');
    });

    describe('.uriString()', function() {
      var resource = 'some/resource';
      var uriBase = framework.url.format({
        protocol: API.base.protocol,
        host: API.base.host,
        pathname: framework.path.join(API.base.pathname, resource),
      });
      var tokenQuery    = {token: framework.crocodoc.token};
      var tokenQS       = framework.qs.stringify(tokenQuery);
      var uriResource   = instance.uriString(resource);
      var uriFromQuery  = instance.uriString(resource, tokenQuery);
      var uriFromQS     = instance.uriString(resource, tokenQS);

      it('should throw errors with invalid resource parameters', function() {
        framework.values.invalidParamList.forEach(function(e) {
          framework.throwsError(function() {
            instance.uriString(e.value);
          }, 'Expected an error with a resource param of type '+e.name);
        });
      });
      it('should create the correct uri for a resource ('+uriBase+')', function() {
        framework.assert(uriResource === uriBase, 'URI is not correct URI base: '+uriResource);
      });
      it('should create a uri from a querystring which starts with the resource URI ('+uriBase+')', function() {
        framework.assert(uriFromQS.indexOf(uriBase) === 0, 'URI does not start with resource URI: '+uriFromQS);
      });
      it('should create a uri from a querystring which contains the api token ('+tokenQS+')', function() {
        framework.assert(uriFromQS.indexOf(tokenQS) >= 0, 'URI does not contain token: '+uriFromQS);
      });
      it('should create a uri from a query hash which starts with the resource URI ('+uriBase+')', function() {
        framework.assert(uriFromQuery.indexOf(uriBase) === 0, 'URI does not start with resource URI: '+uriFromQuery);
      });
      it('should create a uri from a query hash which contains the api token ('+tokenQS+')', function() {
        framework.assert(uriFromQuery.indexOf(tokenQS) >= 0, 'URI does not contain token: '+uriFromQuery);
      });
    });

    describe('.get()', function() {
      commonInstanceMethodTests(instance.get);
    });

    describe('.post()', function() {
      commonInstanceMethodTests(instance.post);
    });
  });
});
