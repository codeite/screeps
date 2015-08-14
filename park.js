module.exports = function (creep) {

    if(creep.carry.energy > 0){
	    creep.moveTo(Game.spawns.Spawn1);
		creep.transferEnergy(Game.spawns.Spawn1)
    } else if(Game.flags.Park) {
		creep.moveTo(Game.flags.Park);    
    }
}