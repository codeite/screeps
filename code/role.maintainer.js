module.exports = maintainer;

Creep.prototype.maintainer = maintainer;

function maintainer(intel) {
    var creep = this;
    //creep.say('E'+creep.carry.energy);
    var res = 0;
    //return;
    var source = creep.room.rootSpawn;

    if(creep.room.storage && source.energy === 0) {
        source = creep.room.storage;
    }

   
    var dindex = ~~creep.memory.dindex;
    
    var extensions = intel.extensions;
    var loops =  extensions.length;
    if(extensions.length <= 0) {
        creep.say('No ext');
        return;
    }
   
   
    while((!extensions[dindex]  || extensions[dindex].energy == extensions[dindex].energyCapacity) && loops > 0) {
        dindex = (dindex+1)%extensions.length;
        loops--;
    }
    //console.log(dindex, extensions[dindex].e);
    
    if(!loops) return;
    creep.memory.dindex = dindex;
    var destination = Game.getObjectById(intel.extensions[dindex].id);
    if(destination) creep.memory.destination = destination.id;
    
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
            
             //creep.memory.dindex = ((~~(creep.memory.dindex))+1)%(destinations.length);
            //console.log('creep.memory.dindex2', creep.memory.dindex);
        }
	}
	
	//console.log(creep.memory.dindex+'E'+ creep.carry.energy + 'R'+res+'M'+creep.memory.mode);
}