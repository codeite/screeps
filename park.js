module.exports = function (creep) {

  if(!creep.memory.config) {
        creep.memory.config = {};
    }


    if(!creep.memory.config.flag) {
        creep.memory.config.flag = 'Park';
    }

    if(creep.memory.config.flag) {
        var flag = Game.flags[creep.memory.config.flag];
        
        if(flag){
            creep.moveTo(flag);
            return;
        }
    }

    if(creep.carry.energy > 0){
	    creep.moveTo(Game.spawns.Spawn1);
		creep.transferEnergy(Game.spawns.Spawn1)
    } else if(Game.flags.Park) {
		creep.moveTo(Game.flags.Park);    
    }
}