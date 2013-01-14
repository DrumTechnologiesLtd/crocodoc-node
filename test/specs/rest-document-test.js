// Tests for the crocodoc document API
var API = require('api/document');

// setup the common rest response tests
var restTests = framework.restTests(it);
var _200Checks = restTests._200Checks;
var _400Checks = restTests._400Checks;
var _JsonContentChecks = restTests._JsonContentChecks;
var pollTimeout = framework.timeouts.poll;
var responseTimeout = framework.timeouts.response;

// make sure we clean temporarily created uuids
after(function(done) {
  this.timeout(responseTimeout * (framework.tempUuid.uuids.length+1));
  framework.tempUuid.purge(done);
});

describe('Crocodoc API: REST: document', function() {
  var instance = new API(framework.crocodoc.token);
  var preloadedUuid;

  it('should preload a file without timing out', function(done) {
    this.timeout(pollTimeout);
    framework.tempUuid.fromFile('test/support/files/simple-presentation.ppt', function(e, r, b) {
      framework.assert(typeof b.uuid === 'string', 'Could not pre-load a document for the tests');
      preloadedUuid = b.uuid;
      framework.tempUuid.waitFor(preloadedUuid, done);
    });
  });

  describe('.status()', function() {
    describe('with a single uuid for a preloaded file', function() {
      var error, response, body;

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.status(preloadedUuid, function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should be an array', function() {
          framework.assert(framework.isArray(body), 'Expected body to be an array, not: '+typeof body);
        });
        it('should have exactly one member element', function() {
          framework.assert(body.length === 1, 'Expected body length to be 1, not: '+body.length);
        });

        describe('the element', function() {
          it('should have a non-empty string uuid field', function() {
            framework.assert(typeof body[0].uuid === 'string' && body[0].uuid.length > 0, 'Expected body[0].uuid to be a non-empty string, not: ('+typeof body[0].uuid+'): '+body[0].uuid);
          });
          it('should have an undefined error field', function() {
            framework.assert(body[0].error === undefined, 'Expected body[0].error to be undefined, not: ('+typeof body[0].error+'): '+body[0].error);
          });
          it('should have a non-empty string status field', function() {
            framework.assert(typeof body[0].status === 'string' && body[0].status.length > 0, 'Expected body[0].status to be a non-empty string, not: ('+typeof body[0].status+'): '+body[0].status);
          });
          it('should have a boolean viewable field', function() {
            framework.assert(typeof body[0].viewable === 'boolean', 'Expected body[0].viewable to be boolean, not: ('+typeof body[0].viewable+'): '+body[0].viewable);
          });
        });
      });
    });

    describe('with a single non-existent uuid in a string', function() {
      var error, response, body;

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.status('non-existent Uuid', function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should be an array', function() {
          framework.assert(framework.isArray(body), 'Expected body to be an array, not: '+typeof body);
        });
        it('should have exactly one member element', function() {
          framework.assert(body.length === 1, 'Expected body length to be 1, not: '+body.length);
        });

        describe('the element', function() {
          it('should have a non-empty uuid string field', function() {
            framework.assert(typeof body[0].uuid === 'string' && body[0].uuid.length > 0, 'Expected body[0].uuid to be a non-empty string, not: ('+typeof body[0].uuid+'): '+body[0].uuid);
          });
          it('should have a truthy error field', function() {
            framework.assert(body[0].error, 'Expected body[0].error to be truthy, not: ('+typeof body[0].error+'): '+body[0].error);
          });
        });
      });
    });

    var uuids = ['uuid1', 'uuid2', 'uuid3'];
    describe('with multiple comma separated uuids in a string', function() {
      var error, response, body;

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.status(uuids.join(','), function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should be an array', function() {
          framework.assert(framework.isArray(body), 'Expected body to be an array, not: ('+typeof body+'): '+framework.inspect(body, true, 0));
        });
        it('should have the correct number of elements', function() {
          framework.assert(body.length === uuids.length, 'Expected body length to be '+uuids.length+', not: '+body.length);
        });
      });
    });
  });

  describe('.uploadUrl()', function() {
    describe('with a malformed url', function() {
      var uuid, error, response, body;

      // wait for the conversion to finish, to avoid exceeding the rate limiter
      after(function(done) {
        this.timeout(pollTimeout);
        instance.poll(uuid, done);
      });

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.uploadUrl('not a url', function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should have a non-empty uuid string field', function() {
          framework.assert(typeof body.uuid === 'string' && body.uuid.length > 0, 'Expected body.uuid to be a non-empty string, not: ('+typeof body.uuid+'): '+body.uuid);
          uuid = body.uuid;
          framework.tempUuid.add(uuid);
        });
        describe('the final retrieved status', function() {
          var _fe, _fr, _fb;

          it('should poll for a final response without timing out', function(done) {
            this.timeout(pollTimeout);
            instance.poll(uuid, function(e, r, b) {
              _fe = e;
              _fr = r;
              _fb = b;
              done();
            });
          });

          _200Checks(function(){return _fe;}, function(){return _fr;}, function(){return _fb;});
          _JsonContentChecks(function(){return _fe;}, function(){return _fr;}, function(){return _fb;});

          it('should have a body.status field of "ERROR"', function() {
            framework.assert(_fb.status === 'ERROR', 'Expected body.status to be "ERROR", not: '+typeof _fb.status+'): '+_fb.status);
          });
          it('should have a body.viewable field of false', function() {
            framework.assert(_fb.viewable === false, 'Expected body.viewable to be false, not: '+typeof _fb.viewable+'): '+_fb.viewable);
          });
          it('should have a truthy body.error field', function() {
            framework.assert(_fb.error, 'Expected body.error to be truthy, not: '+typeof _fb.error+'): '+_fb.error);
          });
        });
      });
    });

    describe('with a good url', function() {
      var uuid, error, response, body;

      // wait for the conversion to finish, to avoid exceeding the rate limiter
      after(function(done) {
        this.timeout(pollTimeout);
        instance.poll(uuid, done);
      });

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.uploadUrl('http://web.crocodoc.com/files/test-simple.pdf', function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should have a non-empty uuid string field', function() {
          framework.assert(typeof body.uuid === 'string' && body.uuid.length > 0, 'Expected body.uuid to be a non-empty string, not: ('+typeof body.uuid+'): '+body.uuid);
          uuid = body.uuid;
          framework.tempUuid.add(uuid);
        });
        it('should have an undefined error field', function() {
          framework.assert(body.error === undefined, 'Expected body.error to be undefined, not: ('+typeof body.error+'): '+body.error);
        });
        describe('the final retrieved status', function() {
          var _fe, _fr, _fb;

          it('should poll for a final response without timing out', function(done) {
            this.timeout(pollTimeout);
            instance.poll(uuid, function(e, r, b) {
              _fe = e;
              _fr = r;
              _fb = b;
              done();
            });
          });

          _200Checks(function(){return _fe;}, function(){return _fr;}, function(){return _fb;});
          _JsonContentChecks(function(){return _fe;}, function(){return _fr;}, function(){return _fb;});

          it('should have a body.status field of "DONE"', function() {
            framework.assert(_fb.status === 'DONE', 'Expected body.status to be "DONE", not: '+typeof _fb.status+'): '+_fb.status);
          });
          it('should have a body.viewable field of true', function() {
            framework.assert(_fb.viewable === true, 'Expected body.viewable to be true, not: '+typeof _fb.viewable+'): '+_fb.viewable);
          });
          it('should have an undefined body.error field', function() {
            framework.assert(_fb.error === undefined, 'Expected body.error to be undefined, not: '+typeof _fb.error+'): '+_fb.error);
          });
        });
      });
    });
  });

  describe('.uploadFile()', function() {
    describe('with an unsupported file type', function() {
      var error, response, body;

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.uploadFile('test/support/files/unsupported.txt', function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _400Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should have an undefined uuid field', function() {
          framework.assert(body.uuid === undefined, 'Expected body.uuid to be undefined, not: ('+typeof body.uuid+'): '+body.uuid);
        });
        it('should have a truthy error field', function() {
          framework.assert(body.error, 'Expected body.error to truthy, not: ('+typeof body.error+'): '+body.error);
        });
      });
    });
    describe('with a supported file type', function() {
      var uuid, error, response, body;

      // wait for the conversion to finish, to avoid exceeding the rate limiter
      after(function(done) {
        this.timeout(pollTimeout);
        instance.poll(uuid, done);
      });

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.uploadFile('test/support/files/simple-presentation.ppt', function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should have a non-empty uuid string field', function() {
          framework.assert(typeof body.uuid === 'string' && body.uuid.length > 0, 'Expected body.uuid to be a non-empty string, not: ('+typeof body.uuid+'): '+body.uuid);
          uuid = body.uuid;
          framework.tempUuid.add(uuid);
        });
        it('should have an undefined error field', function() {
          framework.assert(body.error === undefined, 'Expected body.error to be undefined, not: ('+typeof body.error+'): '+body.error);
        });
        describe('the final retrieved status', function() {
          var _fe, _fr, _fb;

          it('should poll for a final response without timing out', function(done) {
            this.timeout(pollTimeout);
            instance.poll(uuid, function(e, r, b) {
              _fe = e;
              _fr = r;
              _fb = b;
              done();
            });
          });

          _200Checks(function(){return _fe;}, function(){return _fr;}, function(){return _fb;});
          _JsonContentChecks(function(){return _fe;}, function(){return _fr;}, function(){return _fb;});

          it('should have a body.status field of "DONE"', function() {
            framework.assert(_fb.status === 'DONE', 'Expected body.status to be "DONE", not: '+typeof _fb.status+'): '+_fb.status);
          });
          it('should have a body.viewable field of true', function() {
            framework.assert(_fb.viewable === true, 'Expected body.viewable to be true, not: '+typeof _fb.viewable+'): '+_fb.viewable);
          });
          it('should have an undefined body.error field', function() {
            framework.assert(_fb.error === undefined, 'Expected body.error to be undefined, not: '+typeof _fb.error+'): '+_fb.error);
          });
        });
      });
    });
  });

  describe('.remove()', function() {
    describe('with a non-existent uuid', function() {
      var error, response, body;

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.remove('non-existent uuid', function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _400Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should have an undefined uuid field', function() {
          framework.assert(body.uuid === undefined, 'Expected body.uuid to be undefined, not: ('+typeof body.uuid+'): '+body.uuid);
        });
        it('should have a truthy error field', function() {
          framework.assert(body.error, 'Expected body.error to truthy, not: ('+typeof body.error+'): '+body.error);
        });
      });
    });
    describe('with a uuid of a pre-loaded document', function() {
      var error, response, body;

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.remove(preloadedUuid, function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should be true', function() {
          framework.assert(body === true, 'Expected body to be true, not: ('+ typeof body +'): '+body);
          framework.tempUuid.remove(preloadedUuid);
        });
      });
    });
  });
});
