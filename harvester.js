module.exports = function (creep) {
    try {
	if(creep.carry.energy < creep.carryCapacity) {
	    var source;
	    if(creep.memory.sourceId) {
	        source = Game.getObjectById(creep.memory.sourceId);
	        if(!source) creep.memory.sourceId = null;
	    } else if(creep.memory.config.flag) {
	        var flag = Game.flags[creep.memory.config.flag];

	        
	        if(false && flag){
	            var found = flag.pos.lookFor('source');
                if(found.length) {
                    source = found[0];
                    creep.memory.sourceId = source.id;
                }
	        }
	    } else {
		    source = creep.room.find(FIND_SOURCES)[0];
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
    }catch(e) {
        console.log('Error:', e);
    }
}