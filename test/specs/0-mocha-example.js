// The standard mocha example, using the framework's assert
describe('mocha example (using framework)', function() {
  describe('Array', function(){
    describe('#indexOf()', function(){
      it('should return -1 when the value is not present', function(){
        framework.assert.equal(-1, [1,2,3].indexOf(5));
        framework.assert.equal(-1, [1,2,3].indexOf(0));
      });
    });
  });
});
