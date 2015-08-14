module.exports = function (creep) {
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    
    var source = creep.room.find(FIND_FLAGS, {
            filter: { name: creep.memory.source }
        })[0];
    
    var destination = creep.room.find(FIND_FLAGS, {
            filter: { name: creep.memory.destination }
        })[0];
    
    //console.log(source, destination);
    
    if(!creep.memory.mode) {
        creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'U';
        }
    } else if(creep.memory.mode === 'U') {
        if(creep.carry.energy === 0) {
            creep.memory.mode = 'L';
        }
    }
    
    if(creep.memory.mode === 'L') {
        creep.moveTo(source);
        var e =source.pos.lookFor('energy');
        if(e.length)
            res = creep.pickup(e[0]);
        else 
            res = -1;
        
    } else if(creep.memory.mode === 'U') {
        creep.moveTo(destination);
        if(creep.pos.x == destination.pos.x && creep.pos.y == destination.pos.y)
            res = creep.dropEnergy();
        
	}

	
	//creep.say(creep.memory.dindex+'E'+ creep.carry.energy + 'R'+res+'M'+creep.memory.mode);
}