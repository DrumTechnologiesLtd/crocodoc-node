// Don't use the framework's assert,
// since this is trying to validate that the framework exists!
var assert = require('assert');

describe('framework', function() {
  it ('should be a truthy global', function() {
    assert(framework, 'Expected global framework to be truthy, not: '+framework);
  });
  it ('should be an object', function() {
    assert(typeof framework === 'object', 'Expected framework to be an object, not: '+(typeof framework));
  });

  describe('.assert', function() {
    it ('should be truthy', function() {
      assert(framework.assert, 'Expected framework.assert to be truthy, not: '+framework.assert);
    });
    it ('should be a function', function() {
      assert(typeof framework.assert === 'function', 'Expected framework.assert to be a function, not: '+(typeof framework.assert));
    });
  });

  describe('.url', function() {
    it ('should be truthy', function() {
      assert(framework.url, 'Expected framework.url to be truthy, not: '+framework.url);
    });
    it ('should be an object', function() {
      assert(typeof framework.url === 'object', 'Expected framework.url to be an object, not: '+(typeof framework.url));
    });
  });

  describe('.path', function() {
    it ('should be truthy', function() {
      assert(framework.path, 'Expected framework.path to be truthy, not: '+framework.path);
    });
    it ('should be an object', function() {
      assert(typeof framework.path === 'object', 'Expected framework.path to be an object, not: '+(typeof framework.path));
    });
  });

  describe('.qs', function() {
    it ('should be truthy', function() {
      assert(framework.qs, 'Expected framework.qs to be truthy, not: '+framework.qs);
    });
    it ('should be an object', function() {
      assert(typeof framework.qs === 'object', 'Expected framework.qs to be an object, not: '+(typeof framework.qs));
    });
  });

  describe('.inspect', function() {
    it ('should be truthy', function() {
      assert(framework.inspect, 'Expected framework.inspect to be truthy, not: '+framework.inspect);
    });
    it ('should be a function', function() {
      assert(typeof framework.inspect === 'function', 'Expected framework.inspect to be a function, not: '+(typeof framework.inspect));
    });
  });

  describe('.exec', function() {
    it ('should be truthy', function() {
      assert(framework.exec, 'Expected framework.exec to be truthy, not: '+framework.exec);
    });
    it ('should be a function', function() {
      assert(typeof framework.exec === 'function', 'Expected framework.exec to be a function, not: '+(typeof framework.exec));
    });
  });

  describe('.throwsError', function() {
    it ('should be truthy', function() {
      assert(framework.throwsError, 'Expected framework.throwsError to be truthy, not: '+framework.throwsError);
    });
    it ('should be a function', function() {
      assert(typeof framework.throwsError === 'function', 'Expected framework.throwsError to be a function, not: '+(typeof framework.throwsError));
    });
  });

  describe('.values', function() {
    it ('should be truthy', function() {
      assert(framework.values, 'Expected framework.values to be truthy, not: '+framework.values);
    });
    it ('should be an object', function() {
      assert(typeof framework.values === 'object', 'Expected framework.values to be an object, not: '+(typeof framework.values));
    });
    describe('.invalidParamList',function() {
      it ('should be truthy', function() {
        assert(framework.values.invalidParamList, 'Expected framework.values.invalidParamList to be truthy, not: '+framework.values.invalidParamList);
      });
      it ('should be an object', function() {
        assert(typeof framework.values.invalidParamList === 'object', 'Expected framework.values.invalidParamList to be an object, not: '+(typeof framework.values.invalidParamList));
      });
    });
  });

  describe('.crocodoc', function() {
    it ('should be truthy', function() {
      assert(framework.crocodoc, 'Expected framework.crocodoc to be truthy, not: '+framework.crocodoc);
    });
    it ('should be an object', function() {
      assert(typeof framework.crocodoc === 'object', 'Expected framework.crocodoc to be an object, not: '+(typeof framework.crocodoc));
    });
    describe('.token', function() {
      it ('should be truthy', function() {
        assert(framework.crocodoc.token, 'Expected framework.crocodoc.token to be truthy, not: '+framework.crocodoc.token);
      });
      it ('should be a string', function() {
        assert(typeof framework.crocodoc.token === 'string', 'Expected framework.crocodoc.token to be a string, not: '+(typeof framework.crocodoc.token));
      });
    });
  });
});
