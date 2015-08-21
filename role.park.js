module.exports = function (creep) {


    if(!creep.config.flag) {
        creep.config.flag = 'Park';
    }

    if(creep.config.flag) {
        var flag = Game.flags[creep.config.flag];
        
        if(flag){
            creep.moveTo(flag);
            return;
        }
    }

    if(creep.carry.energy > 0){
	    creep.moveTo(creep.room.rootSpawn);
		creep.transferEnergy(creep.room.rootSpawn)
    } else if(Game.flags[creep.room.name+'-Park']) {
		creep.moveTo(Game.flags[creep.room.name+'-Park']);    
    } else if(Game.flags.Park) {
        creep.moveTo(Game.flags.Park);    
    }

}