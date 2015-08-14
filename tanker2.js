module.exports = function (creep) {
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    
    
    
    if(!creep.memory.mode) {
        creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'U';
            creep.memory.target = null;
        }
    } else if(creep.memory.mode === 'U') {
        if(creep.carry.energy === 0) creep.memory.mode = 'L';
    }
    
    var target;
    if(creep.memory.mode === 'L') {
    
        if(!creep.memory.target) {
            var target = creep.pos.findClosest(FIND_DROPPED_ENERGY);
            if(!target) return;
            creep.memory.target = target.id;
        }
        target = Game.getObjectById(creep.memory.target);
        
        if(!target){
            creep.memory.target = null;
        }
        
        creep.moveTo(target);
        res = creep.pickup(target);
    } else if(creep.memory.mode === 'U') {
        creep.moveTo(Game.spawns.Spawn1);
		creep.transferEnergy(Game.spawns.Spawn1)
    }
	
	 //creep.say('E:'+ creep.carry.energy + 'R:'+res+'M:'+creep.memory.mode);
}