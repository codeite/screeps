module.exports = {
    static : function (creep) {
    
        if(creep.carry.energy < creep.carryCapacity) {
            var e = creep.pos.lookFor('energy');
            if(e.length)  creep.pickup(e[0]);
        }
        
	    if(creep.pos.isNearTo(creep.room.controller)) {
	        if(creep.carry.energy > 0 && Memory.stratergy.pump) {
	            
    	        var res = creep.upgradeController(creep.room.controller);
    	        if(res === OK){
    	            Memory.stats.pumped += workRate(creep);
    	        }
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
    	            var res = creep.upgradeController(creep.room.controller);
        	        if(res === OK){
        	            Memory.stats.pumped += workRate(creep);
        	        }
    	        }
    	    } else {
    		    creep.moveTo(creep.room.controller);
    	    }
    	}
    }
}

function workRate(creep) {
    var energy = creep.carry.energy;
    var workParts = _.filter(creep.body, function(b){return b.type === WORK}).length;
    var min = Math.min(energy, workParts);
    //console.log('a', energy, workParts, min);
    return min;
}