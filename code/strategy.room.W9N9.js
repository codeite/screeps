var ConstructionFactory = require('ConstructionFactory');
var limits = require('intel.limits');
var buildStyles = require('strategy.buildStyles');

module.exports = {
    setupInfrastructure: setupInfrastructure,
    maintainInfrastructure: maintainInfrastructure,
    plan: plan
};

function setupInfrastructure(spawn) {
    var room = spawn.room;
    var currentLimits = limits(room.controller.level);
    //console.log(level, typeof level);
    var factory = new ConstructionFactory(room, currentLimits);

    buildStyles.planExtensionRows(spawn, factory, currentLimits);

    factory.save();
    factory.placeConstructionSites(STRUCTURE_ROAD);
    factory.placeConstructionSites(STRUCTURE_EXTENSION);
}

function maintainInfrastructure(spawn) {
    
}

function plan(spawn) {
    return {
        storageStratergy: 'nearSource:14:13',
        storageLocation: {x: 15, y: 15}
    }
}