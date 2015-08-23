var should = require('chai').should()


var caching = require('../js');

describe('js', function() {
  
  describe('betterSplit', function () {
    describe('without count param', function () {
      it('should not split if no deliminator', function () {
        var res = 'alpha-beta'.betterSplit(':');
        // console.log('res:', res);
        res.should.have.length(1);
        res[0].should.equal('alpha-beta');
      });

      it('should split in half', function () {
        
        var res = 'alpha:beta'.betterSplit(':');
        //console.log('res:', res);
        res.should.eql(['alpha', 'beta']);
      });

      it('should split many times', function () {
        'a:b:c:d:e:f'.betterSplit(':').should.eql(['a', 'b', 'c', 'd', 'e', 'f']);
      });
    });

    describe('with count param = 1', function () {
      it('should not split if no deliminator', function () {
        var res = 'alpha-beta'.betterSplit(':', 1);
        //console.log('res:', res);
        res.should.have.length(1);
        res[0].should.equal('alpha-beta');
      });

      it('should not split even if deliminator', function () {
        var res = 'alpha:beta'.betterSplit(':', 1)
        //console.log('res:', res);
        res.should.have.length(1);
        res[0].should.equal('alpha:beta');
      });

      it('should not split many times', function () {
        var res = 'a:b:c:d:e:f'.betterSplit(':', 1)
        //console.log('res:', res);
        res.should.have.length(1);
        res[0].should.equal('a:b:c:d:e:f');
      });
    });

    describe('with count param = 2', function () {
     

      it('should split in half', function () {
        
        var res = 'alpha:beta'.betterSplit(':', 2);
        //console.log('res:', res);
        res.should.eql(['alpha', 'beta']);
      });

      it('should only split on first', function () {
        var res = 'a:b:c:d:e:f'.betterSplit(':', 2);
        //console.log('res:', res);
        res.should.have.length(2);
        res[0].should.equal('a');
        res[1].should.equal('b:c:d:e:f');
      });
    });

    describe('with count param = 3', function () {
     

      it('should split in half', function () {
        
        var res = 'alpha:beta'.betterSplit(':', 3);
        //console.log('res:', res);
        res.should.eql(['alpha', 'beta']);
      });

      it('should only split on first and second', function () {
        var res = 'a:b:c:d:e:f'.betterSplit(':', 3);
        //console.log('res:', res);
        res.should.have.length(3);
        res[0].should.equal('a');
        res[1].should.equal('b');
        res[2].should.equal('c:d:e:f');
      });
    });
  });

});

  