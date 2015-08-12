module.exports = function (creep) {
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    
    
    function getTarget(descriptor) {
        var bits = descriptor.split(':');
        if(bits[0] == 'C') {
            return Game.creeps[bits[1]];
        } else if(bits[0] == 'S') {
            return Game.spawns[bits[1]];
        } else if(bits[0] == 'T') {
            return Game.structures[bits[1]];
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
    
    
    var source = getTarget(config.source);
    var destinations = config.destination.split(';');
    var dindex = ~~creep.memory.dindex;
    
    var destination = getTarget(destinations[dindex]);
    
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
        res = source.transferEnergy(creep);
        
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
        } else res = 'l';
	}
	
	//console.log(creep.pos, destination.pos);
	//console.log(creep.memory.dindex+'E'+ creep.carry.energy + 'R'+res+'M'+creep.memory.mode);
}
