module.exports = {
    buildMobile: buildMobile,
    buildStatic: buildStatic,
    build2: build2
}

function buildMobile(creep) {

    if(creep.carry.energy == 0) {
        if(Memory.stratergy.preventBuild) return;
        var energySource = null;
        
        if(creep.memory.sourceId) {
            energySource = Game.getObjectById(creep.memory.sourceId);
            if(!energySource) creep.memory.sourceId = null;
        }
        
        if(!energySource && creep.memory.config.useClosestEnergy) {
            energySource = creep.pos.findClosest(FIND_STRUCTURES, {
                filter: function(object) {
                    //console.log('looking for closest', object, object.energy, object.store && object.store.energy);
                    return object.energy > 0 || (object.store && object.store.energy > 0);
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
	} else {
	    creep.memory.sourceId = null;
	    
	    var target;
	    //console.log(creep.memory.targetId);
	    if(creep.memory.targetId) {
            target = Game.getObjectById(creep.memory.targetId);
            if(!target) creep.memory.targetId = null;
        }
        
        if(!target) {
	    
    		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    		if(targets.length) {
    		    target = targets[0];
    		    creep.memory.targetId = target.id;
    		}
        }
    		
		if(target){
		    if(!creep.pos.isNearTo(target)) {
			    creep.moveTo(target);
		    } else {
		        if(target instanceof ConstructionSite) {
			        creep.build(target);
		        } else if (target instanceof Structure) {
		            creep.repair(target);
		            if(target.hits == target.hitsMax) {
		                 creep.memory.targetId = null;
		            }
		        }
		    }
		} else if(Object.keys(Memory.repairJobs).length) {
		    var mostUrgentJob = _.min(Memory.repairJobs, function(job) {
                return job.hits;
            });
            
            var struct = creep.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
  
            if(struct.length) {
                console.log('Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                creep.memory.targetId = struct[0].id;
                delete Memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y]
            }
            
		 
		} else if(Game.flags.Park) {
		    creep.moveTo(Game.flags.Park);
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

