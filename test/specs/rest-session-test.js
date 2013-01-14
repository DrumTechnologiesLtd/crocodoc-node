// Tests for the crocodoc document API
var API = require('api/session');

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

describe('Crocodoc API: REST: session', function() {
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

  describe('.create()', function() {
    describe('with a uuid for a preloaded file', function() {
      var error, response, body;

      it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.create(preloadedUuid, function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _200Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should have a non-empty session string field', function() {
          framework.assert(typeof body.session === 'string' && body.session.length > 0, 'Expected body.session to be a non-empty string, not: ('+typeof body.session+'): '+body.session);
        });
        it('should have an undefined error field', function() {
          framework.assert(body.error === undefined, 'Expected body.error to be undefined, not: ('+typeof body.error+'): '+body.error);
        });
      });
    });

    describe('with a non-existent uuid', function() {
      var error, response, body;

        it('should respond without timing out', function(done) {
        this.timeout(responseTimeout);
        instance.create('non-existent uuid', function(e, r, b) {
          error = e;
          response = r;
          body = b;
          done();
        });
      });

      _400Checks(function(){return error;}, function(){return response;}, function(){return body;});
      _JsonContentChecks(function(){return error;}, function(){return response;}, function(){return body;});

      describe('the response body', function() {
        it('should have an undefined session field', function() {
          framework.assert(body.session === undefined, 'Expected body.session to be undefined, not: ('+typeof body.session+'): '+body.session);
        });
        it('should have a truthy error field', function() {
          framework.assert(body.error, 'Expected body.error to be truthy, not: ('+typeof body.error+'): '+body.error);
        });
      });
    });
  });
});
