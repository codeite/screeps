module.exports = {
    buildMobile: buildMobile,
    buildStatic: buildStatic,
    buildUpkeep: buildUpkeep
}

Creep.prototype.builder = buildMobile;
Creep.prototype.buildMobile = buildMobile;
Creep.prototype.buildStatic = buildStatic;
Creep.prototype.upkeep = buildUpkeep;
Creep.prototype.buildUpkeep = buildUpkeep;

function buildUpkeep(intel) {

    if(this.carry.energy == 0) {
        //var inSitue = this.pos.lookFor('energy');
        //if(inSitue.length) {
        //    this.pickup(inSitue[0]);
        //}

        if(this.room.memory.strategy.preventBuild) {
            this.say('No B!');
            return;
        }
        var energySource = null;
        
        if(this.memory.sourceId) {
            energySource = Game.getObjectById(this.memory.sourceId);
            if(!energySource) this.memory.sourceId = null;
        }
        
        if(!energySource && this.config.buildSource) {
            var sourceFlag = Game.flags[this.config.buildSource];
            var flagStructure = sourceFlag.pos.lookFor('structure');
            
            if(flagStructure.length) {
                energySource = flagStructure[0];
                this.memory.sourceId = energySource.id;
            } else {
                var flagCreep = sourceFlag.pos.lookFor('creep');
            
                if(flagCreep.length) {
                    energySource = flagCreep[0];
                    this.memory.sourceId = energySource.id;
                }
            }
        }
        
        if(!energySource && this.config.useClosestEnergy) {
            energySource = this.pos.findClosest(FIND_STRUCTURES, {
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


        if(!energySource && this.room.rootSpawn) {
            energySource = this.room.rootSpawn;
        }

        if(!energySource) {
            this.say('No Src!');
        }

        if(!this.pos.isNearTo(energySource)) {

		    this.moveTo(energySource);
        } else {
		    energySource.transferEnergy(this);
        }
	} else {
	    this.memory.sourceId = null;
	    
	    var target;
        //console.log(this.memory.targetId);
        if(this.memory.targetId) {
            target = Game.getObjectById(this.memory.targetId);
            if(!target) this.memory.targetId = null;
        }

        
        if(!target && this.config.priorityMainanence &&  Object.keys(this.room.memory.repairJobs).length) {
            var mostUrgentJob = _.min(this.room.memory.repairJobs, function(job) {
                return job.hits;
            });
            
            var struct = this.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
  
            if(struct.length) {
                console.log('Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                this.memory.targetId = struct[0].id;
                delete this.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y];
                target = Game.getObjectById(this.memory.targetId);
            }
            
         
        }

        if(!target && Game.flags[this.room.name+'-Priority']) {
            var tatgetFlag = Game.flags[this.room.name+'-Priority'];
            var flagSite = tatgetFlag.pos.lookFor('constructionSite');
            
            if(flagSite.length) {
                target = flagSite[0];
                this.memory.targetId = target.id;
            }
        }
        
    



		if(target){
		    if(!this.pos.isNearTo(target)) {
                this.say('Mv');
			    this.moveTo(target);
		    } else {
		        if(target instanceof ConstructionSite) {
			        this.build(target);
		        } else if (target instanceof Structure) {
		            this.repair(target);
		            if(target.hits == target.hitsMax) {
		                 this.memory.targetId = null;
		            }
		        }
		    }
		} else if(!this.config.dontRepair &&  Object.keys(this.room.memory.repairJobs).length) {
		    
            while(!target && Object.keys(this.room.memory.repairJobs).length) {
                var mostUrgentJob = _.min(this.room.memory.repairJobs, function(job) {
                    return job.hits;
                });
                
                var struct = this.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
      
                if(struct.length) {
                    console.log(this, 'Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                    this.memory.targetId = struct[0].id;
                    target = Game.getObjectById(struct[0].id);
                    delete this.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y]
                } else {
                    console.log('Repair job at ',mostUrgentJob.x, mostUrgentJob.y, 'expired.')
                    delete this.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y]
                }
            }
		} else if(Game.flags[this.room.name+'-Park']) {
            this.moveTo(Game.flags[this.room.name+'-Park']);
        }   
        else if(Game.flags.Park) {
		    this.moveTo(Game.flags.Park);
		} else {
            this.say('Nothing td!');
        }


        
	}

}

function buildMobile(intel) {

    if(this.carry.energy == 0) {
        //var inSitue = this.pos.lookFor('energy');
        //if(inSitue.length) {
        //    this.pickup(inSitue[0]);
        //}

        if(this.room.memory.strategy.preventBuild) {
            this.say('No B!');
            return;
        }
        var energySource = null;
        
        if(this.memory.sourceId) {
            energySource = Game.getObjectById(this.memory.sourceId);
            if(!energySource) this.memory.sourceId = null;
        }
        
        if(!energySource && this.config.buildSource) {
            var sourceFlag = Game.flags[this.config.buildSource];
            var flagStructure = sourceFlag.pos.lookFor('structure');
            
            if(flagStructure.length) {
                energySource = flagStructure[0];
                this.memory.sourceId = energySource.id;
            } else {
                var flagCreep = sourceFlag.pos.lookFor('creep');
            
                if(flagCreep.length) {
                    energySource = flagCreep[0];
                    this.memory.sourceId = energySource.id;
                }
            }
        }
        
        if(!energySource && this.config.useClosestEnergy) {
            energySource = this.pos.findClosest(FIND_STRUCTURES, {
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


        if(!energySource && this.room.rootSpawn) {
            energySource = this.room.rootSpawn;
        }

        if(!energySource) {
            this.say('No Src!');
        }

        if(!this.pos.isNearTo(energySource)) {

            this.moveTo(energySource);
        } else {
            energySource.transferEnergy(this);
        }
    } else {
        this.memory.sourceId = null;
        
        var target;
        //console.log(this.memory.targetId);
        if(this.memory.targetId) {
            target = Game.getObjectById(this.memory.targetId);
            if(!target) this.memory.targetId = null;
        }

        
        if(!target && this.config.priorityMainanence &&  Object.keys(this.room.memory.repairJobs).length) {
            var mostUrgentJob = _.min(this.room.memory.repairJobs, function(job) {
                return job.hits;
            });
            
            var struct = this.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
  
            if(struct.length) {
                console.log('Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                this.memory.targetId = struct[0].id;
                delete this.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y];
                target = Game.getObjectById(this.memory.targetId);
            }
            
         
        }

        if(!target && Game.flags[this.room.name+'-Priority']) {
            var tatgetFlag = Game.flags[this.room.name+'-Priority'];
            var flagSite = tatgetFlag.pos.lookFor('constructionSite');
            
            if(flagSite.length) {
                target = flagSite[0];
                this.memory.targetId = target.id;
            }
        }
        
        if(!target && this.config.buildTarget) {
            var tatgetFlag = Game.flags[this.config.buildTarget];
            var flagSite = tatgetFlag.pos.lookFor('constructionSite');
            
            if(flagSite.length) {
                target = flagSite[0];
                this.memory.targetId = target.id;
            }
        }
        
        if(!target) {
        
            var targets = this.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                target = targets[0];
                this.memory.targetId = target.id;
            }
        }



        if(target){
            if(!this.pos.isNearTo(target)) {
                this.say('Mv');
                this.moveTo(target);
            } else {
                if(target instanceof ConstructionSite) {
                    this.build(target);
                } else if (target instanceof Structure) {
                    this.repair(target);
                    if(target.hits == target.hitsMax) {
                         this.memory.targetId = null;
                    }
                }
            }
        } else if(!this.config.dontRepair &&  Object.keys(this.room.memory.repairJobs).length) {
            var mostUrgentJob = _.min(this.room.memory.repairJobs, function(job) {
                return job.hits;
            });
            
            var struct = this.room.lookForAt('structure', mostUrgentJob.x, mostUrgentJob.y);
  
            if(struct.length) {
                console.log('Taking on repair job at',mostUrgentJob.x, mostUrgentJob.y, mostUrgentJob.hits)
                this.memory.targetId = struct[0].id;
                delete this.room.memory.repairJobs[mostUrgentJob.x+':'+mostUrgentJob.y]
            }
            
         
        } else if(Game.flags[this.room.name+'-Park']) {
            this.moveTo(Game.flags[this.room.name+'-Park']);
        }   
        else if(Game.flags.Park) {
            this.moveTo(Game.flags.Park);
        } else {
            this.say('Nothing td!');
        }


        
    }

}

function buildStatic(intel) {
    //if(this.carry.energy > 0) {
        
        var target = Game.getObjectById(this.memory.target);
        
        if(this.carry.energy == 0) {
            var targets = this.pos.findInRange(FIND_MY_STRUCTURES, 1);
            var withEnergy = _.filter(targets, function(s){
                return s.energy || (s.store && s.store.energy);
            })

            if(withEnergy.length) {
                targets[0].transferEnergy(this);
            }
        }

        if(!target && Game.flags[this.room.name+'-Priority']) {
            var tatgetFlag = Game.flags[this.room.name+'-Priority'];
            var flagSite = tatgetFlag.pos.lookFor('constructionSite');
            
            if(flagSite.length) {
                target = flagSite[0];
                this.memory.targetId = target.id;
            }
        }

        if(!target) {
            var targets = this.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                target = targets[0];
                this.memory.target = target.id;
            }
        }
   

		if(target) {
		    if(!this.pos.isNearTo(target)) {
			    this.moveTo(target);
		    } else {
			    this.build(target);
		    }
		}
	//}
}

