
module.exports = function (creep) {
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    
    
    
    
    var config = creep.memory.config || {};
    
    //console.log('tanker4:', config.industry, Memory.stratergy.pump)
    if(config.industry == 'pump' && Memory.stratergy.pump === false) {
        creep.moveTo(creep.room.rootSpawn);
        creep.transferEnergy(creep.room.rootSpawn);
        //creep.say('pump - off');
        return;
    }
    
    
    var source = creep.getTarget(config.source, creep);
    var destinations = config.destination.split(';');
    var dindex = ~~creep.memory.dindex;
    
    var destination = creep.getTarget(destinations[dindex], creep);
    //console.log('destination', destination, destinations, dindex);
    
    //console.log(dindex, source, destination);
    if(creep.ticksToLive < 100 && creep.carry.energy == 0) {
        creep.suicide();
        return;
    }
    
    if(!creep.memory.mode) {
        creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'U';
            //creep.memory.dindex = (dindex+1)%destinations.length;
        }
    } else if(creep.memory.mode === 'U') {
        if(creep.carry.energy === 0) creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        creep.moveTo(source);
        if(source && source.transferEnergy) res = source.transferEnergy(creep);
        if(source instanceof Energy) {
            res = creep.pickup(source);
            //console.log('energy:', source.energy);
            if(source.energy < 10) {
                var curTarget = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
                    filter: function(object) {
                        return object.id != source.id;
                    }
                });
                if(curTarget) creep.memory.target = curTarget.id;
            }
        }
        
        if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'U';
            //creep.memory.dindex = (dindex+1)%destinations.length;
        } else if(!source) {
            //creep.say('No src');
            //creep.moveTo(Game.flags.Park);
        }
        
    }
    
    if(creep.memory.mode === 'U') {
        if(destination) {
           
            if(creep.pos.isNearTo(destination)) {
                
                res = creep.transferEnergy(destination);
                
                if(res == ERR_FULL) {
                    //console.log('creep.memory.dindex1', creep.memory.dindex);
                    
                     creep.memory.dindex = ((~~(creep.memory.dindex))+1)%(destinations.length);
                    //console.log('creep.memory.dindex2', creep.memory.dindex);
                }
            } else {
                creep.moveTo(destination.pos);
                res = 't';
            }
        } else {
            res = 'l';
            creep.say('No Tgt!');
        }
	}
	
	//console.log(creep.pos, destination.pos);
	//console.log(creep.memory.dindex+'E'+ creep.carry.energy + 'R'+res+'M'+creep.memory.mode);
}