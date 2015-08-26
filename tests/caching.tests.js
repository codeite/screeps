var should = require('chai').should()

function resetGlobals() {
  function Room () {}
  function Memory () {}
  function RoomPosition (roomName, x, y) {this.roomName=roomName,this.x=x, this.y=y;}

  GLOBAL._ = require('lodash');
  GLOBAL.Room = Room;
  GLOBAL.Memory = Memory;
  GLOBAL.RoomPosition = RoomPosition;

  GLOBAL.ERR_INVALID_ARGS = -10;

  GLOBAL.Memory.cache = {};

  //console.log('Set globals');
}

var caching;

describe('caching', function() {
  
  beforeEach(function() {
    resetGlobals();
    caching = require('../code/caching');
  });

  describe('RoomPosition.toCanonString()', function () {
    it('should return N1W2:3:4 when given a RoomPosition', function () {
      var rp = new RoomPosition('N1W2', 3, 4);
      var cannonForm = rp.toCanonString();
      cannonForm.should.equal('N1W2:3:4');
    });
  });

  describe('caching.findPathOptionsToCannonString()', function () {
    it('should convert known parameters to their short form for caching', function () {
      var options = {
        ignoreCreeps: true,
        ignoreDestructibleStructures: true,
        maxOps: 1000,
        heuristicWeight:2
      };

      var cannonForm = caching.findPathOptionsToCannonString(options);
      cannonForm.should.equal('ic-t:ids-t:mo-1000:hw-2');
    });

    it('should autofill default values', function () {
      var options = {};

      var cannonForm = caching.findPathOptionsToCannonString(options);
      cannonForm.should.equal('ic-f:ids-f:mo-2000:hw-1');
    });

    it('should return ERR_INVALID_ARGS for unsupported args', function () {
      var options = {ignore:[]};
      var cannonForm = caching.findPathOptionsToCannonString(options);
      cannonForm.should.equal(ERR_INVALID_ARGS);
    });

    it('should return ERR_INVALID_ARGS for unknown args', function () {
      var options = {gibberish:[]};
      var cannonForm = caching.findPathOptionsToCannonString(options);
      cannonForm.should.equal(ERR_INVALID_ARGS);
    });
  });

});
