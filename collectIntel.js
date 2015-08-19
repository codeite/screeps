
module.exports = function collectIntel(spawn) {
    if(!spawn) {
        console.log('No spawn');
        return null;
    }
    var room = spawn.room;
    room.rootSpawn = spawn;
    
    var pos = spawn.pos;
    var intel = {
        controllerLevel: room.controller.level,
        progressLevel: room.controller.level,
        totalEnergy: spawn.energy,
        maxEnergy: spawn.energyCapacity,
        structures: 0
    };
    
    var allConstructionSites = room.find(FIND_CONSTRUCTION_SITES); 
    intel.constructionSites = allConstructionSites;
    
    intel.nearestEnergy = spawn.pos.findClosestByRange(FIND_SOURCES);
    
    // top left bottom right
    var allStructures = room.find(FIND_MY_STRUCTURES);
    room.memory.allStructures = allStructures;
    
    intel.totalEnergy = spawn.energy;
    intel.maxEnergy = spawn.energyCapacity;
    
    //var structureLook = room.lookForAtArea('structure', pos.y-2, pos.x-5, pos.y+7, pos.x+2);
    //intel.structures = cleanLook(structureLook);
    intel.extensions = _.filter(allStructures, function(x) { return x.structureType === STRUCTURE_EXTENSION;});
    intel.extensionSites = _.filter(allConstructionSites, function(x) { return x.structureType === STRUCTURE_EXTENSION;});
    _.each(intel.extensions, function(v, k) {
        intel.totalEnergy += v.energy;
        intel.maxEnergy += v.energyCapacity;
    });
        
    intel.reserves = intel.totalEnergy / intel.maxEnergy;
    
    if(intel.controllerLevel >= 5) {
        spawn.room.txLink = spawn.txLink = spawn.getTarget('L:nearestTo:Z');
        spawn.room.rxLink = spawn.rxLink = spawn.getTarget('L:nearestTo:Ct');
    }

    intel.farSources = _.filter(intel.energySources, function(x) {return x.id != intel.nearestEnergy.id; });
    
    
    if(!intel.importantPlaces) intel.importantPlaces = {};
    
    if(!intel.importantPlaces.storageAndTx || (Game.time % 600) === 0) {
        intel.importantPlaces.storageAndTx = spawn.findPosNextTo('Z', 'L:nearestTo:Z');
    }
    
    if(!intel.importantPlaces.sourceAndStorage || (Game.time % 600) === 1) {
        intel.importantPlaces.sourceAndStorage = spawn.findPosNextTo('Sr', 'Z');
    }
    
    if(!intel.importantPlaces.controllerAndRx || (Game.time % 600) === 2) {
        intel.importantPlaces.controllerAndRx = spawn.findPosNextTo('Ct', 'L:nearestTo:Ct');
    }
    
    //console.log('intel.structures.length:', intel.structures.length, ' progressLevel:', intel.progressLevel);
    room.memory.intel = intel;
    return intel;
}

function cleanLook(look) {
    look = _.map(look, function(x){return _.map(x, function(y){if(typeof y === 'object'){return y[0]}else{return undefined};});});
    return _.flatten(look);
}
