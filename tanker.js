module.exports = function (creep) {
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    
    if(!creep.memory.mode) {
        creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        if(creep.carry.energy === creep.carryCapacity) creep.memory.mode = 'U';
    } else if(creep.memory.mode === 'U') {
        if(creep.carry.energy === 0) creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        
    } else if(creep.memory.mode === 'U') {
        creep.moveTo(creep.room.controller);
        res = creep.upgradeController(creep.room.controller);
	}
	
	 creep.say('E:'+ creep.carry.energy + 'R:'+res+'M:'+creep.memory.mode);
}
