// Tests for the crocodoc document API
var API = require('api/download');

var fs = require('fs');
var ws;

function commonInstanceMethodTests(testMethod, paramName, goodParamValue, goodUuidValue) {
  it('should throw an error with no parameters', function() {
    framework.throwsError(function() {
      testMethod();
    });
  });

  it('should throw an error with a good uuid param, a writeable stream, and no callback', function() {
    framework.throwsError(function() {
      testMethod(goodUuidValue, ws);
    });
  });
  it('should throw an error with a good uuid param, a writeable stream, and a non-function callback', function() {
    framework.throwsError(function() {
      testMethod(goodUuidValue, ws, 'not a function');
    });
  });

  for (var k in framework.values.invalidParamList) {
    it('should throw an error with a '+framework.values.invalidParamList[k].name+' uuid param, a writeable stream, and a function callback', function () {
      framework.throwsError(function() {
        testMethod(framework.values.invalidParamList[k].value, ws, function(){});
      });
    });
  }

  if (!paramName) {
    it('should throw an error with a good uuid, a writeable stream, an extra param, and a callback', function() {
      framework.throwsError(function() {
        testMethod(goodUuidValue, ws, 'extra param', function(){});
      });
    });
  }
  else {
    it('should throw an error with a good uuid param, '+paramName+', a writeable stream, and no callback', function() {
      framework.throwsError(function() {
        testMethod(goodUuidValue, goodParamValue, ws);
      });
    });
    it('should throw an error with a good uuid param, '+paramName+', a writeable stream, and a non-function callback', function() {
      framework.throwsError(function() {
        testMethod(goodUuidValue, goodParamValue, ws, 'not a function');
      });
    });

    for (var k in framework.values.invalidParamList) {
      it('should throw an error with a '+framework.values.invalidParamList[k].name+' uuid param, '+paramName+', a writeable stream, and a function callback', function () {
        framework.throwsError(function() {
          testMethod(framework.values.invalidParamList[k].value, goodParamValue, ws, function(){});
        });
      });
    }

    it('should throw an error with a good uuid, '+paramName+', a writeable stream, an extra param, and a callback', function() {
      framework.throwsError(function() {
        testMethod(goodUuidValue, goodParamValue, ws, 'extra param', function(){});
      });
    });
  }
}

before(function(){
  ws = fs.createWriteStream('/tmp/anyfile');
});
after(function(){
  ws.end();
});

describe('Crocodoc API: Client Library: download', function() {
  describe('constructor', function() {
    it('should throw an error with no API Token', function() {
      framework.throwsError(function() {
        new API();
      });
    });
    it('should throw an error if too many args are passed', function() {
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

    it('should have a document function', function() {
      framework.assert(typeof instance.document === 'function');
    });
    it('should have a thumbnail function', function() {
      framework.assert(typeof instance.thumbnail === 'function');
    });
    it('should have a text function', function() {
      framework.assert(typeof instance.text === 'function');
    });

    describe('.document()', function() {
      commonInstanceMethodTests(instance.document, 'options', {}, 'reasonableUuid')
    });
    describe('.thumbnail()', function() {
      commonInstanceMethodTests(instance.thumbnail, 'size', '100x100', 'reasonableUuid')
    });
    describe('.text()', function() {
      commonInstanceMethodTests(instance.text, undefined, undefined, 'reasonableUuid')
    });

  });
});
