var chassis = require('chassis');
var infraChain = require('infra.chain');

module.exports = {
    applyStrategy: applyLevelOne
};

function applyLevelOne(spawn, intel, army) {
    
    var source = spawn.room.storage;
    var dest = Game.creeps.Sydney;
    var name = 'chain1';
    var creepCount = 6;
    var drillSpot = intel.importantPlaces.drillSpots[0];

    army.push({chassis: chassis.basicWorker, name: 'Harvester', role: 'harvester', config: {industry: 'energy', pos: drillSpot.sites[1]}});

    var drillSite = drillSpot.sites[0]
    army.push({chassis: chassis.staticWorker(2), name: 'Drill1', role: 'drill', config:{pos: drillSite }});
          
    var creeps = infraChain.buildChain(spawn, "FCP:"+drillSite.x+":"+drillSite.y, "Sr", "Drill1Chain", 2);
    Array.append(army, creeps);
    
    var pumperName = 'Pumper1';
    army.push({chassis: chassis.largestWorker(intel.maxEnergy), name: pumperName, role: 'pumper.immobile'});

    var creeps = infraChain.buildChain(spawn, 'Sr', 'R:'+pumperName, 'PumperChain', 2);
    Array.append(army, creeps);
    return;
    
    // Get to 6 Basic workers. 3 Harvest, 3 Pump
    var i=1;
    for(; i<=3; i++)
        army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+i, role: 'harvester', config: {industry: 'energy', pos: intel.energySites[i-1]}});
    for(; i<=6; i++)
        army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+i, role: 'pumper.mobile', config: {industry: 'pump'}});

}