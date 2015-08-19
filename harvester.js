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
	    
	    if(!creep.pos.isNearTo(Game.spawns.Spawn1.room.storage)) {
		    creep.moveTo(Game.spawns.Spawn1.room.storage);
	    } else {
		    creep.transferEnergy(Game.spawns.Spawn1.room.storage);
	    }
	}
    }catch(e) {
        console.log('Error:', e);
    }
}