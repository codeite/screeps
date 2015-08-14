module.exports = function collectIntel(spawn) {
    if(!spawn) {
        console.log('No spawn');
        return {
            controllerLevel: 0,
            progressLevel: 0,
            totalEnergy: 0,
            maxEnergy: 0,
            structures: 0
        };
    }
    
    var pos = spawn.pos;
    var intel = {
        controllerLevel: spawn.room.controller.level,
        progressLevel: spawn.room.controller.level,
        totalEnergy: spawn.energy,
        maxEnergy: spawn.energyCapacity,
        structures: 0
    };
    
    intel.nearestEnergy = spawn.pos.findClosestByRange(FIND_SOURCES);
    
    // top left bottom right
    if(intel.controllerLevel > 1) {
        var allStructures;
        if(Game.time % 10 == 0) {
            allStructures = spawn.room.find(FIND_MY_STRUCTURES);
            spawn.room.memory.allStructures = allStructures;
        } else {
            allStructures = spawn.room.memory.allStructures;
        }
        
        var structureLook = spawn.room.lookForAtArea('structure', pos.y-2, pos.x-5, pos.y+2, pos.x+2);
        intel.structures = cleanLook(structureLook);
        
        if(intel.structures.length < 6){
            intel.progressLevel = 2.1;
        } else {
            intel.progressLevel = 2.2
        }
        
        if(intel.progressLevel > 2.1) {
            _.each(intel.structures, function(v, k){
                if(v.structureType === STRUCTURE_EXTENSION) {
                    intel.totalEnergy += v.energy;
                    intel.maxEnergy += v.energyCapacity;
                }
            })
        }
        
        intel.reserves = intel.totalEnergy / intel.maxEnergy;
        
        //id327990
        //intel.energySources = spawn.room.find(FIND_SOURCES, {
        //    filter: function(object) { return object.id != 'id327990' }
        //});
        intel.farSources = _.filter(intel.energySources, function(x) {return x.id != intel.nearestEnergy.id; });
    }
    
    if(!Memory.stats) Memory.stats = {};
    Memory.stats.energy = "Energy "+intel.totalEnergy+" of "+intel.maxEnergy +" ("+(~~(intel.reserves*100))+"%)";
    
    //console.log('intel.structures.length:', intel.structures.length, ' progressLevel:', intel.progressLevel);
    Memory.intel = intel;
    return intel;
}

function cleanLook(look) {
    look = _.map(look, function(x){return _.map(x, function(y){if(typeof y === 'object'){return y[0]}else{return undefined};});});
    return _.flatten(look);
}
