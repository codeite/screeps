module.exports = function (creep) {
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    
    
    function getTarget(descriptor, creep) {
        var bits = descriptor.split(':');
        if(bits[0] == 'C') {
            return Game.creeps[bits[1]];
        } else if(bits[0] == 'R') {
            var creep = Game.registry.getCreep(bits[1]);
            return creep;
        } else if(bits[0] == 'S') {
            return Game.spawns[bits[1]];
        } else if(bits[0] == 'I') {
            var bid = Game.getObjectById[bits[1]];
            //console.log('bid', bid, bits[1]);
            return bid;
        } else if(bits[0] == 'Z') {
            var bid = Game.getObjectById[bits[1]];
            //console.log('bid', bid, bits[1]);
            return Game.spawns.Spawn1.storage;
        } else if(bits[0] == 'T') {
            return Game.structures[bits[1]];
        } else if(bits[0] == 'F') {
            var curTarget = Game.getObjectById(creep.memory.target);
            
            if(!curTarget) {
                curTarget = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                if(curTarget) creep.memory.target = curTarget.id;
            }
            
            return curTarget;
        }
    }
    
    var config = creep.memory.config || {};
    
    //console.log('tanker4:', config.industry, Memory.stratergy.pump)
    if(config.industry == 'pump' && Memory.stratergy.pump === false) {
        creep.moveTo(Game.spawns.Spawn1);
        creep.transferEnergy(Game.spawns.Spawn1);
        //creep.say('pump - off');
        return;
    }
    
    
    var source = getTarget(config.source, creep);
    var destinations = config.destination.split(';');
    var dindex = ~~creep.memory.dindex;
    
    var destination = getTarget(destinations[dindex], creep);
    //console.log('destination', destination, destinations, dindex);
    
    //console.log(dindex, source, destination);
    
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
        
    } else if(creep.memory.mode === 'U') {
        if(destination) {
            creep.moveTo(destination.pos);
            if(creep.pos.isNearTo(destination)) {
                
                res = creep.transferEnergy(destination);
                
                if(res == ERR_FULL) {
                    //console.log('creep.memory.dindex1', creep.memory.dindex);
                    
                     creep.memory.dindex = ((~~(creep.memory.dindex))+1)%(destinations.length);
                    //console.log('creep.memory.dindex2', creep.memory.dindex);
                }
            } else {
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