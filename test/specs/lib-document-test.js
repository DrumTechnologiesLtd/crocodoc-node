// Tests for the Crocodoc API document client
//
var API = require('api/document');

function commonInstanceMethodTests(testMethod, paramName, goodParamValue) {
  it('should throw an error with no parameters', function() {
    framework.throwsError(function() {
      testMethod();
    });
  });
  it('should throw an error with a good '+paramName+' param, and no callback', function() {
    framework.throwsError(function() {
      testMethod(goodParamValue);
    });
  });
  it('should throw an error with a good '+paramName+' param, and a non-function callback', function() {
    framework.throwsError(function() {
      testMethod(goodParamValue, 'not a function');
    });
  });
  for (var k in framework.values.invalidParamList) {
    it('should throw an error with a '+framework.values.invalidParamList[k].name+' '+paramName+' param, and a function callback', function() {
      framework.throwsError(function() {
        testMethod(framework.values.invalidParamList[k].value, function(){});
      });
    });
  }
  it('should throw an error with a good '+paramName+' param, an extra param, and a function callback', function() {
    framework.throwsError(function() {
      testMethod(goodParamValue, 'extra', function(){});
    });
  });
}

describe('Crocodoc API: Client Library: document', function() {
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

    it('should have a status function', function() {
      framework.assert(typeof instance.status === 'function');
    });
    it('should have an uploadUrl function', function() {
      framework.assert(typeof instance.uploadUrl === 'function');
    });
    it('should have an uploadFile function', function() {
      framework.assert(typeof instance.uploadFile === 'function');
    });
    it('should have a remove function', function() {
      framework.assert(typeof instance.remove === 'function');
    });
    it('should have a poll function', function() {
      framework.assert(typeof instance.poll === 'function');
    });
    describe('.status()', function() {
      commonInstanceMethodTests(instance.status, 'uuids', 'reasonableUuid');
    });

    describe('.uploadUrl()', function() {
      commonInstanceMethodTests(instance.uploadUrl, 'URL', 'http://web.crocodoc.com/files/test-simple.pdf');
    });

    describe('.uploadFile()', function() {
      before(function(done){
        // create an unreadable file, since you can't commit one in git!
        framework.exec('echo "something" >unreadable; chmod a-r unreadable', function(error, stdout, stderr) {
          framework.assert(!error, 'Did not expect to get an error creating an unreadable file: '+error);
          done();
        });
      });
      after(function(done){
        // cleanup the unreadable file
        framework.exec('rm -f unreadable', function(error, stdout, stderr) {
          framework.assert(!error, 'Did not expect to get an error removing the unreadable file: '+error);
          done();
        });
      });

      commonInstanceMethodTests(instance.uploadFile, 'filepath', 'test/support/files/simple-presentation.ppt');

      it('should throw an error with a non-existent file', function() {
        framework.throwsError(function() {
          instance.uploadFile('file does not exist');
        });
      });
      it('should throw an error with a directory', function() {
        framework.throwsError(function() {
          instance.uploadFile('test');
        });
      });
      it('should throw an error with an unreadable file', function() {
        framework.throwsError(function() {
          instance.uploadFile('unreadable');
        });
      });
    });

    describe('.remove()', function() {
      commonInstanceMethodTests(instance.remove, 'uuid', 'reasonableUuid');
    });

    describe('.poll()', function() {
      commonInstanceMethodTests(instance.poll, 'uuid', 'reasonableUuid');
    });
  });
});
