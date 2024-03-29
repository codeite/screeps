
module.exports = function collectIntel(spawn) {
    if(!spawn) {
        console.log('No spawn');
        return null;
    }

    var room = spawn.room;
    room.rootSpawn = spawn;
    
    var pos = spawn.pos;
    var intel = room.memory.intel || {
        structures: 0
    };

    intel.controllerLevel = room.controller ? room.controller.level : 0;
    intel.progressLevel = room.controller.level;
    intel.totalEnergy =  spawn.energy;
    intel.maxEnergy = spawn.energyCapacity;

    // console.log(intel.energySites.map(function(s){ return s.x+','+s.y+'; ';}));

    if(!intel.energySites) {
        var sites = [];
        var usedSources = [];
        var source;

        do {
            var source = spawn.pos.findClosest(FIND_SOURCES, {
                filter: function(source) {
                    return usedSources.indexOf(source) == -1;
                }
            });
            //console.log('source', source, source.pos);


            if(source) {
                usedSources.push(source)

                var possiblePositions = source.pos.getAdjacentPositions();
                possiblePositions = _.filter(possiblePositions, function(pos) {
                    var found = pos.lookFor('terrain');
                    return found[0] == 'plain';
                });
                //console.log('possiblePositions', possiblePositions);

                while(possiblePositions.length) {
                    var closest = spawn.pos.closestOf(possiblePositions);
                    possiblePositions.splice(possiblePositions.indexOf(closest), 1);
                    sites.push({
                        x: closest.x,
                        y: closest.y,
                        sourceId: source.id
                    });
                }
            }

        } while(sites.length < 3 && source);

        intel.energySites = sites;
    }



    
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

    intel.links = _.filter(allStructures, function(x) { return x.structureType === STRUCTURE_LINK;});
        
    intel.reserves = intel.totalEnergy / intel.maxEnergy;
    
    if(intel.controllerLevel >= 5) {
        spawn.room.txLink = spawn.txLink = spawn.getTarget('L:nearestTo:Z');
        spawn.room.rxLink = spawn.rxLink = spawn.getTarget('L:nearestTo:Ct');
    }

    intel.farSources = _.filter(intel.energySources, function(x) {return x.id != intel.nearestEnergy.id; });
    
    
    if(!intel.importantPlaces) intel.importantPlaces = {};
    
    if(!intel.importantPlaces.drillSpots || intel.importantPlaces.drillSpots.length == 0) {
            intel.importantPlaces.drillSpots = findDrillSpots(spawn);
        }

    if(room.storage){
        if(!intel.importantPlaces.storageAndTx || (Game.time % 600) === 0) {
            intel.importantPlaces.storageAndTx = spawn.findPosNextTo('Z', 'L:nearestTo:Z');
        }
    
        if(!intel.importantPlaces.sourceAndStorage || (Game.time % 600) === 1) {
            intel.importantPlaces.sourceAndStorage = spawn.findPosNextTo('E', 'Z');
        }
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

function findDrillSpots(spawn) {
    var sources = [];
    var usedSources = [];
    var source;
    var limit = 10;

    do {
        var source = spawn.pos.findClosestByRange(FIND_SOURCES, {
            filter: function(source) {
                return usedSources.indexOf(source) == -1;
            }
        });
        console.log('source', source);


        if(source) {
            var sites = [];
            usedSources.push(source)

            var possiblePositions = source.pos.getAdjacentPositions();
            possiblePositions = _.filter(possiblePositions, function(pos) {
                var found = pos.lookFor('terrain');
                return found[0] !== 'wall';
            });
            //console.log('possiblePositions', possiblePositions);

            while(possiblePositions.length) {
                var closest = spawn.pos.closestOf(possiblePositions);
                possiblePositions.splice(possiblePositions.indexOf(closest), 1);
                sites.push({
                    x: closest.x,
                    y: closest.y,
                    sourceId: source.id
                });
            }
            sources.push({
                source: {
                    x: source.pos.x, 
                    y: source.pos.y, 
                    id: source.id
                },
                sites: sites
            })
        }

    } while(source && limit-- > 0);

    return sources;
}
