module.exports = function (creep) {
    // - Vars -
    // flagName - Flag to park at
    
    // - Mem -
    // sourceId - Id of source to mine
    // flagId - Id of source to mine
    // mode - mode
    // path
    
    // - Modes -
    // M - Move to flag
    // D - Drill
    
    if(!creep.memory.flagId) {
        var targets = creep.room.find(FIND_FLAGS, {
            filter: { name: creep.memory.flagName }
        });
        if(targets.length) {
            creep.memory.flagId = targets[0].id;
            
            var path = creep.room.findPath(creep.pos, targets[0].pos);
            console.log('path-len:', path.length, path);
            creep.memory.path = path;
        } else {
            creep.say('No Flag!');
        }
    }
    
    var path = creep.memory.path;
    if(path) {
       
        var moved = creep.move(path[0].direction);
        
        if(moved == 0) {
            creep.say("M dist"+path.length);
            path.shift();
            console.log('Looking at path length to decide future', path.length);
            if(path.length) {
                creep.memory.path = path;
                return;
            } else {
                creep.memory.path = null;
            }
        } else {
            creep.say("M T dist"+path.length);
            return;
        }
    }
    
    var target;
    if(!creep.memory.sourceId) {
        target = creep.pos.findClosest(FIND_SOURCES_ACTIVE);
        creep.memory.sourceId = target.id;
    }
    
    if(!target) {
        target = Game.getObjectById(creep.memory.sourceId);
    }

    //creep.say("H d"+creep.ticksToLive);
	var res = creep.harvest(target);
	//console.log('d2', res, target);
	
	if(res == ERR_NOT_IN_RANGE){
	    creep.memory.sourceId = null;
	}
}