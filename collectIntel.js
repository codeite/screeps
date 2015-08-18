
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
    
    intel.constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    
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
        
        var structureLook = spawn.room.lookForAtArea('structure', pos.y-2, pos.x-5, pos.y+7, pos.x+2);
        intel.structures = cleanLook(structureLook);
        intel.extensions = _.map(_.filter(intel.structures, function(x) { return x.structureType === STRUCTURE_EXTENSION;}), function(y){return {id:y.id, e: y.energyCapacity - y.energy};});
        
        if(intel.controllerLevel < 4) {
            
            if(intel.structures.length < 6){
                intel.progressLevel = 2.1;
            } else {
                intel.progressLevel = 2.2
            }
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
        
        
        if(intel.controllerLevel >= 4) {
            spawn.storage = Game.getObjectById(Memory.idCache.storageId);
            //console.log('Memory.idCache.storageId', Memory.idCache.storageId);
            
            if(!spawn.storage) {
                var found = Game.flags.Storage.pos.lookFor('structure');
                if(found.length) {
                    var storageFound = _.filter(found, function (x) {return x.structureType == 'storage'});
                    
                    if(storageFound.length) {
                        spawn.storage = storageFound[0];
                        Memory.idCache.storageId = spawn.storage.id;
                    }
                }
            }
        }
        
        if(intel.controllerLevel >= 5) {
            spawn.room.txLink = spawn.txLink = spawn.getTarget('L:nearestTo:Z');
            spawn.room.rxLink = spawn.rxLink = spawn.getTarget('L:nearestTo:Ct');
        }
        
        //id327990
        //intel.energySources = spawn.room.find(FIND_SOURCES, {
        //    filter: function(object) { return object.id != 'id327990' }
        //});
        intel.farSources = _.filter(intel.energySources, function(x) {return x.id != intel.nearestEnergy.id; });
    }
    
    if(!intel.importantPlaces) intel.importantPlaces = {};
    
    if(!intel.importantPlaces.storageAndTx || (Game.time % 600) === 0) {
        intel.importantPlaces.storageAndTx = spawn.findPosNextTo('Z', 'L:nearestTo:Z');
    }
    
    if(!intel.importantPlaces.sourceAndStorage || (Game.time % 600) === 0) {
        intel.importantPlaces.sourceAndStorage = spawn.findPosNextTo('Sr', 'Z');
    }
    
    if(!intel.importantPlaces.controllerAndRx || (Game.time % 600) === 0) {
        intel.importantPlaces.controllerAndRx = spawn.findPosNextTo('Ct', 'L:nearestTo:Ct');
    }
    
    //console.log('intel.structures.length:', intel.structures.length, ' progressLevel:', intel.progressLevel);
    Memory.intel = intel;
    return intel;
}

function cleanLook(look) {
    look = _.map(look, function(x){return _.map(x, function(y){if(typeof y === 'object'){return y[0]}else{return undefined};});});
    return _.flatten(look);
}
