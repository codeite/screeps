module.exports = function (creep) {
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    
    var config = creep.memory.config || {};
    var source = Game.getObjectById(config.source);
    var destinations = config.destination.split(';');
    var dindex = ~~creep.memory.dindex;
    
    var destination = Game.getObjectById(destinations[dindex]);
    
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
        creep.moveTo(destination);
        res = creep.transferEnergy(destination);
        
        if(res == ERR_FULL) {
            //console.log('creep.memory.dindex1', creep.memory.dindex);
            
             creep.memory.dindex = ((~~(creep.memory.dindex))+1)%(destinations.length);
            //console.log('creep.memory.dindex2', creep.memory.dindex);
        }
	}
	
	//console.log(creep.memory.dindex+'E'+ creep.carry.energy + 'R'+res+'M'+creep.memory.mode);
}