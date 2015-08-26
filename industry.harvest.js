var chassis = require('chassis');

module.exports = {
    apply: apply
}

if(!Game.industries) Game.industries = {};
Game.industries.harvest = 'harvest';

function apply(spawn, intel) {
    var army = buildArmy(spawn, intel);
}

function buildArmy(spawn, intel) {

    var army, config;

    var creepsInIndustry = _.filter(Game.creeps, function(c) {
        return c.memory.owner === spawn.name && c.config.industry === 'harvest';
    });

    // look at the state of the industry and facilities and descide strategy

    // Emergency state
    if(creepsInIndustry === 0) {
        var config = {pos: intel.importantPlaces.drillSpots[0].drillSpot.sites[0]};
        army.push(createSolider('EmergencyHarvester', Creep.role.harvester, chassis.basicWorker, Game.industries.harvest, config);
        return army;
    }

    if(!spawn.room.storage) {

        // Should be trying to get a lvl6 drill at each source
        for(var i in intel.importantPlaces.drillSpots) {
            var drillSpot = intel.importantPlaces.drillSpots[i];
            
            config = {pos: drillSpot.sites[0] };
            army.push(createSolider('Drill'+i, Creep.role.drill, chassis.staticWorker(2), Game.industries.harvest, config);
                  
            army = army.concat(infraChain.buildChain(spawn, 
                "FCP:"+drillSite.x+":"+drillSite.y,
                "Sr", 
                "Drill1Chain", 
                2)); // ********* should be larger for far sources
        }
    }
}


function createSolider(name, role, chassis, industry, config) {
    return {
        name: name,
        role: role,
        chassis: chassis,
        industry: industry,
        config: config
    };
}
