var ConstructionFactory = require('ConstructionFactory');
var limits = require('intel.limits');

module.exports = {
    setupInfrastructure: setupInfrastructure
};

function setupInfrastructure(room, level) {

    var factory = new ConstructionFactory(room);

    var currentLimits = limits[level];

    buildExtensions(factory, currentLimits);
    factory.placeConstructionSites(STRUCTURE_ROAD);
    factory.placeConstructionSites(STRUCTURE_EXTENSION);
}

function buildExtensions(factory, currentLimits) {
    var rows = Math.ceil(currentLimits.extensions/10);

    for(var row = 0; row < rows; row++){
        var y = row * 3;
        for(var x=2; x<=6; x++) {
            factory.createPermanentConstruction(spawn.pos.x-x, spawn.pos.y+y-1, STRUCTURE_EXTENSION);
            factory.createPermanentConstruction(spawn.pos.x-x, spawn.pos.y+y, STRUCTURE_ROAD);
            factory.createPermanentConstruction(spawn.pos.x-x, spawn.pos.y+y+1, STRUCTURE_EXTENSION);
        }
    }
}
