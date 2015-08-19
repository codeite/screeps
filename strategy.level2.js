var chassis = require('chassis');

module.exports = {
    applyStrategy: applyLevelTwo
};
 
function upgradeToLevelTwo(spawn) {
    //console.log('Upgrade');
    var roads = [];

    for(var dx=1; dx<=5; dx++) {
        roads.push([spawn.pos.x-dx, spawn.pos.y]);

        spawn.room.createConstructionSite(spawn.pos.x-dx, spawn.pos.y-1, STRUCTURE_EXTENSION);
        spawn.room.createConstructionSite(spawn.pos.x-dx, spawn.pos.y+1, STRUCTURE_EXTENSION);
    }

     spawn.room.memory.roads3 = roads;
}

function applyLevelTwo(spawn, intel, army, stratergy) {
    var extensionLimit;
    var drillHeads;

    if(spawn.room.controller.level === 2) {
        extensionLimit = 5;
        drillHeads = 3;
    } else if(spawn.room.controller.level === 3) {
        extensionLimit = 10;
        drillHeads = 6;
    }

    if(intel.extensions.length + intel.extensionSites.length < extensionLimit) {
        upgradeToLevelTwo(spawn);
    }
    
    var stats = {};
    var workerId=1;
    var maintainerId=1;
    

    

    if(intel.extensions.length < 5) {

        var builderCount = 0;
        var reserves = intel.reserves;

        //if (intel.totalEnergy > 200) 
        builderCount++;
        if (intel.totalEnergy > 200) builderCount++;
        if (intel.totalEnergy > 300) builderCount++;
        var havesterCount = 6-builderCount;
        
        
        Memory.stats.havesterCount = havesterCount;
        Memory.stats.builderCount = builderCount;
        
        for(var i=0; i<havesterCount; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester'});
        for(var i=0; i<builderCount; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder', config:{industry: 'construction', useClosestEnergy: true, maxAge: 0}});

        if(intel.extensions.length > 0) {
            army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        }
    } else {
        army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        
        
        var heavyWorkerId = 1;
        var heavyTransportId = 1;
        
        for(var i=0; i<2; i++) { 
          army.push({chassis: chassis.staticWorker(drillHeads), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
          army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'harvest', source: "F", destination: "Sr"} }); 
        }

        if(intel.extensions.length < 10) {
            for(var i=0; i<3; i++) army.push({chassis: chassis.agileWorker, name: 'BasicWorker'+(workerId++), role: 'builder', config:{industry: 'construction', useClosestEnergy: true, maxAge: 0}});

        } else {
            for(var i=0; i<1; i++) { 
                var pumperName = 'HeavyWorker'+(heavyWorkerId++);
                army.push({chassis: chassis.largestWorker(intel.maxEnergy), name: pumperName, role: 'pumper.immobile'});
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName} }); 
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName} });
            }

            var reserves = intel.reserves;
            if(reserves == 1 && intel.constructionSites.length > 0) {
                army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
                army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
            }
        }
        
        //for(var index in intel.farSources) {
        //    var source = intel.farSources[index];
        //    army.push({chassis: heavyWorker, name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill', config:{sourceId: source.id}});
        //    army.push({chassis: heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker2'});
        //}
        
        
    }
}