module.exports = {
    buildMobile: buildMobile,
    buildStatic: buildStatic,
    buildUpkeep: buildUpkeep
}

function buildUpkeep(creep) {

    if(creep.carry.energy == 0) {
        //var inSitue = creep.pos.lookFor('energy');
        //if(inSitue.length) {
        //    creep.pickup(inSitue[0]);
        //}

        if(creep.room.memory.strategy.preventBuild) {
            creep.say('No B!');
            return;
        }
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
            } else {
                var flagCreep = sourceFlag.pos.lookFor('creep');
            
                if(flagCreep.length) {
                    energySource = flagCreep[0];
                    creep.memory.sourceId = energySource.id;
                }
            }
        }
        
        if(!energySource && creep.config.useClosestEnergy) {
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
            creep.say('No Src!');
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

        
        if(!target && creep.config.priorityMainanence &&  Object.keys(creep.room.memory.repairJobs).length) {
            var mostUrgentJob = _.min(creep.room.memory.repairJobs, function(job) {
                return job.hits;
            });
            
            var struct = creep.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
  
            if(struct.length) {
                console.log('Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                creep.memory.targetId = struct[0].id;
                delete creep.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y];
                target = Game.getObjectById(creep.memory.targetId);
            }
            
         
        }

        if(!target && Game.flags[creep.room.name+'-Priority']) {
            var tatgetFlag = Game.flags[creep.room.name+'-Priority'];
            var flagSite = tatgetFlag.pos.lookFor('constructionSite');
            
            if(flagSite.length) {
                target = flagSite[0];
                creep.memory.targetId = target.id;
            }
        }
        
    



		if(target){
		    if(!creep.pos.isNearTo(target)) {
                creep.say('Mv');
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
		} else if(!creep.config.dontRepair &&  Object.keys(creep.room.memory.repairJobs).length) {
		    
            while(!target && Object.keys(creep.room.memory.repairJobs).length) {
                var mostUrgentJob = _.min(creep.room.memory.repairJobs, function(job) {
                    return job.hits;
                });
                
                var struct = creep.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
      
                if(struct.length) {
                    console.log(creep, 'Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                    creep.memory.targetId = struct[0].id;
                    target = Game.getObjectById(struct[0].id);
                    delete creep.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y]
                } else {
                    console.log('Repair job at ',mostUrgentJob.x, mostUrgentJob.y, 'expired.')
                    delete creep.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y]
                }
            }
		} else if(Game.flags[creep.room.name+'-Park']) {
            creep.moveTo(Game.flags[creep.room.name+'-Park']);
        }   
        else if(Game.flags.Park) {
		    creep.moveTo(Game.flags.Park);
		} else {
            creep.say('Nothing td!');
        }


        
	}

}

function buildMobile(creep) {

    if(creep.carry.energy == 0) {
        //var inSitue = creep.pos.lookFor('energy');
        //if(inSitue.length) {
        //    creep.pickup(inSitue[0]);
        //}

        if(creep.room.memory.strategy.preventBuild) {
            creep.say('No B!');
            return;
        }
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
            } else {
                var flagCreep = sourceFlag.pos.lookFor('creep');
            
                if(flagCreep.length) {
                    energySource = flagCreep[0];
                    creep.memory.sourceId = energySource.id;
                }
            }
        }
        
        if(!energySource && creep.config.useClosestEnergy) {
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
            creep.say('No Src!');
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

        
        if(!target && creep.config.priorityMainanence &&  Object.keys(creep.room.memory.repairJobs).length) {
            var mostUrgentJob = _.min(creep.room.memory.repairJobs, function(job) {
                return job.hits;
            });
            
            var struct = creep.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
  
            if(struct.length) {
                console.log('Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                creep.memory.targetId = struct[0].id;
                delete creep.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y];
                target = Game.getObjectById(creep.memory.targetId);
            }
            
         
        }

        if(!target && Game.flags[creep.room.name+'-Priority']) {
            var tatgetFlag = Game.flags[creep.room.name+'-Priority'];
            var flagSite = tatgetFlag.pos.lookFor('constructionSite');
            
            if(flagSite.length) {
                target = flagSite[0];
                creep.memory.targetId = target.id;
            }
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
                creep.say('Mv');
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
        } else if(!creep.config.dontRepair &&  Object.keys(creep.room.memory.repairJobs).length) {
            var mostUrgentJob = _.min(creep.room.memory.repairJobs, function(job) {
                return job.hits;
            });
            
            var struct = creep.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
  
            if(struct.length) {
                console.log('Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                creep.memory.targetId = struct[0].id;
                delete creep.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y]
            }
            
         
        } else if(Game.flags[creep.room.name+'-Park']) {
            creep.moveTo(Game.flags[creep.room.name+'-Park']);
        }   
        else if(Game.flags.Park) {
            creep.moveTo(Game.flags.Park);
        } else {
            creep.say('Nothing td!');
        }


        
    }

}

function buildStatic(creep) {
    //if(creep.carry.energy > 0) {
        
        var target = Game.getObjectById(creep.memory.target);
        
        if(creep.carry.energy == 0) {
            var targets = creep.pos.findInRange(FIND_MY_STRUCTURES, 1);
            var withEnergy = _.filter(targets, function(s){
                return s.energy || (s.store && s.store.energy);
            })

            if(targets.length) {
                targets[0].transferEnergy(creep);
            }
        }

        if(!target && Game.flags[creep.room.name+'-Priority']) {
            var tatgetFlag = Game.flags[creep.room.name+'-Priority'];
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

