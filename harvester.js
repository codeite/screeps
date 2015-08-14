module.exports = function (creep) {

	if(creep.carry.energy < creep.carryCapacity) {
	    var source;
	    if(creep.memory.sourceId) {
	        source = Game.getObjectById(creep.memory.sourceId);
	    } else {
		    source = creep.room.find(FIND_SOURCES)[0];
	    }
	    
	    if(!creep.pos.isNearTo(source)) {
		    creep.moveTo(source);
	    } else {
		    creep.harvest(source);
	    }
	}
	else {
	     
		creep.moveTo(Game.spawns.Spawn1);
		creep.transferEnergy(Game.spawns.Spawn1)
	}
}