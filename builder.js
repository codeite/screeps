module.exports = {
    buildMobile: buildMobile,
    buildStatic: buildStatic
}

function buildMobile(creep) {

    
    if(creep.carry.energy == 0) {
        if(Memory.stratergy.preventBuild) return;
        var energySource = null;
        
        if(creep.memory.sourceId) {
            energySource = Game.getObjectById(creep.memory.sourceId);
            if(!energySource) creep.memory.sourceId = null;
        }
        
        if(!energySource && creep.config.buildSource) {
            var sourceFlag = Game.flags[creep.config.buildSource];
            var flagStructure = sourceFlag.pos.lookFor('structure');
            
            if(flagStructure.length) {
                energySource = flagStructure[0];
                creep.memory.sourceId = energySource.id;
            }
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

        if(!energySource && creep.room.rootSpawn) {
            energySource = creep.room.rootSpawn;
        }

        if(!energySource) {
            creep.say('To Src!');
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
        
        if(!target && creep.config.buildTarget) {
            var tatgetFlag = Game.flags[creep.config.buildTarget];
            var flagSite = tatgetFlag.pos.lookFor('constructionSite');
            
            if(flagSite.length) {
                target = flagSite[0];
                creep.memory.targetId = target.id;
            }
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

