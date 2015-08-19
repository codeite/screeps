module.exports = function (creep) {

	if(creep.carry.energy < creep.carryCapacity) {
	    var source;
      var pos = creep.config.pos;
      if(pos) {
        if(pos.x != creep.x || pos.y != creep.y ) {

          creep.moveTo(pos.x, pos.y);
          return;
        } else {
          if(pos.sourceId){
            creep.memory.sourceId = pos.sourceId;
          }
          
        }
      }

	    if(creep.memory.sourceId) {
	        source = Game.getObjectById(creep.memory.sourceId);
	        if(!source) creep.memory.sourceId = null;
	    } else if(creep.config.flag) {
	        var flag = Game.flags[creep.config.flag];

	        
	        if(false && flag){
	            var found = flag.pos.lookFor('source');
                if(found.length) {
                    source = found[0];
                    creep.memory.sourceId = source.id;
                }
	        }
	    } else {
		    source = creep.pos.findClosestByRange(FIND_SOURCES);
	    }
	    
	    if(!creep.pos.isNearTo(source)) {
		    creep.moveTo(source);
	    } else {
		    creep.harvest(source);
	    }
	} else {

      var target;

      if(creep.room.storage) {
        target = creep.room.storage;
      } else {
        target = creep.room.rootSpawn;
      }
	    
	    if(!creep.pos.isNearTo(target)) {
		    creep.moveTo(target);
	    } else {
		    creep.transferEnergy(target);
	    }
	}

}