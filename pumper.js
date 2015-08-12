module.exports = {
    static : function (creep) {
    
        if(creep.carry.energy < creep.carryCapacity) {
            var e = creep.pos.lookFor('energy');
            if(e.length)  creep.pickup(e[0]);
        }
        
	    if(creep.pos.isNearTo(creep.room.controller)) {
	        if(creep.carry.energy > 0 && Memory.stratergy.pump) {
    	        creep.upgradeController(creep.room.controller);
	        }
	    } else {
		    creep.moveTo(creep.room.controller);
    	}
    },
    mobile : function (creep) {
        
        if(creep.carry.energy == 0) {
            if(!creep.pos.isNearTo(Game.spawns.Spawn1)) {
    		    creep.moveTo(Game.spawns.Spawn1);
            } else {
    		    Game.spawns.Spawn1.transferEnergy(creep);
            }
    	} else {
    	    if(creep.pos.isNearTo(creep.room.controller)) {
    	        if(Memory.stratergy.pump){
    	            creep.upgradeController(creep.room.controller);
    	        }
    	    } else {
    		    creep.moveTo(creep.room.controller);
    	    }
    	}
    }
}
