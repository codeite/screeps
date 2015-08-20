//Creep.prototype.roles.pumpStatic = static

module.exports = {
    immobile: immobile,
    mobile: mobile
};

function immobile (creep) {
    if(creep.config.pos) {
        if(!(creep.pos.x == creep.config.pos.x && creep.pos.y ==creep.config.pos.y)){
            //console.log(creep, 'Moving into pos!');
            creep.say('M');
            creep.moveTo(creep.config.pos);
        } 
    }

    if(creep.carry.energy < creep.carryCapacity) {
        var e = creep.pos.lookFor('energy');
        if(e.length)  creep.pickup(e[0]);
        
        if(creep.room.rxLink && creep.pos.isNearTo(creep.room.rxLink)){
            creep.room.rxLink.transferEnergy(creep);
        }
    }
    
    if(creep.pos.isNearTo(creep.room.controller)) {
        
        /*
        if(!creep.memory.travelTime) {
	        creep.memory.travelTime = 1500 - creep.ticksToLive;
	        Memory.stats.pumperTravelTime.push(creep.memory.travelTime);
	    }
        */
        
        if(creep.carry.energy > 0 && creep.room.memory.strategy.pump) {
            
	        var res = creep.upgradeController(creep.room.controller);
	        if(res === OK){
	            creep.room.memory.stats.pumped += workRate(creep);
	        }
        }
    } else {
	    var res = creep.moveTo(creep.room.controller);
	    
	    if(res == ERR_NO_PATH) {
	        var targets = creep.pos.findInRange(FIND_MY_CREEPS, 1);
            if(targets.length > 0) {
                for(var i in targets) {
                    if(targets[i].role == 'tanker4') {
                        console.log('GET OUT OF MY WAY', targets[i], '!!');
                        targets[i].roleOverride('park', 5);
                    }
                }
            }
	    }
	    
	    //console.log(res);
	}
};

function mobile (creep) {
    
    if(creep.carry.energy == 0) {
        if(!creep.pos.isNearTo(creep.room.rootSpawn)) {
		    creep.moveTo(creep.room.rootSpawn);
        } else {
		    creep.room.rootSpawn.transferEnergy(creep);
        }
	} else {
	    if(creep.pos.isNearTo(creep.room.controller)) {
	        if(creep.room.memory.strategy.pump){
	            var res = creep.upgradeController(creep.room.controller);
    	        if(res === OK){
    	            creep.room.memory.stats.pumped += workRate(creep);
    	        }
	        }
	    } else {
		    var res = creep.moveTo(creep.room.controller);
		  
	    }
	}
};


function workRate(creep) {
    var energy = creep.carry.energy;
    var workParts = _.filter(creep.body, function(b){return b.type === WORK}).length;
    var min = Math.min(energy, workParts);
    //console.log('a', energy, workParts, min);
    return min;
}