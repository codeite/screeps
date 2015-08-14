module.exports = {
    buildMobile: buildMobile,
    buildStatic: buildStatic,
    build2: build2
}

function buildMobile(creep) {
    
    if(creep.carry.energy == 0) {
        if(Memory.stratergy.preventBuild) return;
        var energySource = null;
        
        if(creep.memory.config.useClosestEnergy) {
            energySource = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object) {
                    //console.log('looking for closest', object, object.energy, object.store && object.store.energy);
                    return object.energy > 0 || object.store && object.store.energy > 0;
                }
            });
        }
        
        if(!energySource && Game.flags.BuildEnergy) {
            var structure = Game.flags.Flag1.pos.lookFor('structure');
            if(structure.length && structure[0].energy) {
                energySource = structure;
            }
        }

        if(!energySource) {
            energySource = Game.spawns.Spawn1;
        }
        
        if(!creep.pos.isNearTo(energySource)) {
		    creep.moveTo(energySource);
        } else {
		    energySource.transferEnergy(creep);
        }
	}
	else {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
		    if(!creep.pos.isNearTo(targets[0])) {
			    creep.moveTo(targets[0]);
		    } else {
			    creep.build(targets[0]);
		    }
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

function buildStatic(creep) {
    //if(creep.carry.energy > 0) {
        
        var target = Game.getObjectById(creep.memory.target);
            
        if(!target) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                target = targets[0];
                creep.memory.target = target.id;
            }
        }
   

		if(target) {
		    if(!creep.pos.isNearTo(target)) {
			    creep.moveTo(target);
		    } else {
			    creep.build(target);
		    }
		}
	//}
}

