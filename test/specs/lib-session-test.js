// Tests for the crocodoc document API
var API = require('api/session');

describe('Crocodoc API: Client Library: session', function() {
  describe('constructor', function() {
    it('should throw an error with no API Token', function() {
      framework.throwsError(function() {
        new API();
      });
    });
    it('should throw an error if too many params are passed', function() {
      framework.throwsError(function() {
        new API(framework.crocodoc.token, 1);
      });
    });
    for (var k in framework.values.invalidParamList) {
      it('should throw an error with a '+framework.values.invalidParamList[k].name+' param', function () {
        framework.throwsError(function() {
          new API(framework.values.invalidParamList[k].value);
        });
      });
    }
    it('should NOT throw an error with a non-empty API Token string', function(){
      new API(framework.crocodoc.token);
    });
  });

  describe('instance', function() {
    var instance = new API(framework.crocodoc.token);

    it('should have a create function', function() {
      framework.assert(typeof instance.create === 'function');
    });

    describe('.create()', function() {
      it('should throw an error with no parameters', function() {
        framework.throwsError(function() {
          instance.create();
        });
      });

      it('should throw an error with a good uuid param, no options, and no callback', function() {
        framework.throwsError(function() {
          instance.create('reasonableUuid');
        });
      });
      it('should throw an error with a good uuid param, no options, and a non-function callback', function() {
        framework.throwsError(function() {
          instance.create('reasonableUuid', 'not a function');
        });
      });

      for (var k in framework.values.invalidParamList) {
        it('should throw an error with a '+framework.values.invalidParamList[k].name+' uuid param, no options, and a function callback', function () {
          framework.throwsError(function() {
            instance.create(framework.values.invalidParamList[k].value, function(){});
          });
        });
      }

      it('should throw an error with a good uuid param, options, and no callback', function() {
        framework.throwsError(function() {
          instance.create('reasonableUuid', {});
        });
      });
      it('should throw an error with a good uuid param, options, and a non-function callback', function() {
        framework.throwsError(function() {
          instance.create('reasonableUuid', {}, 'not a function');
        });
      });

      for (var k in framework.values.invalidParamList) {
        it('should throw an error with a '+framework.values.invalidParamList[k].name+' uuid param, options, and a function callback', function () {
          framework.throwsError(function() {
            instance.create(framework.values.invalidParamList[k].value, {}, function(){});
          });
        });
      }

      it('should throw an error with a good uuid, options, an extra param, and a callback', function() {
        framework.throwsError(function() {
          instance.create('reasonableUuid', {}, 'extra param', function(){});
        });
      });
    });
  });
});
