module.exports = build;
module.exports.build2 = build2;

function build(creep) {
    if(creep.carry.energy == 0) {
		creep.moveTo(Game.spawns.Spawn1);
		Game.spawns.Spawn1.transferEnergy(creep);
	}
	else {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			creep.moveTo(targets[0]);
			creep.build(targets[0]);
		}
	}
}

function build2(creep) {
    if(creep.carry.energy == 0) {
		creep.moveTo(Game.spawns.Spawn1);
		Game.spawns.Spawn1.transferEnergy(creep);
	}
	else {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			creep.moveTo(targets[0]);
			creep.build(targets[0]);
		}
	}
}

