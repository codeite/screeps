var chassis = require('chassis');

module.exports = {
    applyStrategy: applyLevelTwo,
    applyInfrastructure: upgradeToLevelTwo
};
 
function upgradeToLevelTwo(spawn) {
    //console.log('Upgrade');
    var roads = [];

    if(spawn.room.name == 'W9N8') {
        for(var dy=1; dy<=5; dy++) {
            var y = spawn.pos.y-(dy+1);
            var xRoad = spawn.pos.x+2+(dy%2);
            var xExt = spawn.pos.x+3-(dy%2);

            roads.push([xRoad, y]);
            spawn.room.createConstructionSite(xExt, y, STRUCTURE_EXTENSION);
            

            //var name = 'W9N8-extension-'+(5+dy);
            //if(Game.flags[name])Game.flags[name].remove();
            //var res = spawn.room.createFlag(xExt, y,  name, COLOR_PURPLE);

            //var name = 'W9N8-road-'+(5+dy);
            //if(Game.flags[name])Game.flags[name].remove();
            //var res = spawn.room.createFlag(xRoad, y,  name, COLOR_GREY);
            //console.log(res);
        }
    } else {
        for(var dx=1; dx<=5; dx++) {
            spawn.room.createConstructionSite(spawn.pos.x-dx, spawn.pos.y-1, STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite(spawn.pos.x-dx, spawn.pos.y+1, STRUCTURE_EXTENSION);
        }
    }
}

function applyLevelTwo(spawn, intel, army, stratergy) {

    if(intel.extensions.length + intel.extensionSites.length < 5) {
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
        
        for(var i=0; i<havesterCount; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester', config: {industry: 'energy', pos: intel.energySites[(i-1)%intel.energySites.length]}});
        for(var i=0; i<builderCount; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder', config:{industry: 'construction', useClosestEnergy: true, maxAge: 0, dontRepair: true}});

        console.log('intel.extensions.length', intel.extensions.length);
        if(intel.extensions.length > 0) {
            console.log('Maintainer');
            army.push({chassis: chassis.transporter(Math.min(intel.extensions.length, 3)), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
            console.log(army.map(function(a){return a.name;}));
        }
    } else {
        army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        
        
        var heavyWorkerId = 1;
        var heavyTransportId = 1;
        
        for(var i=0; i<2; i++) { 
          army.push({chassis: chassis.staticWorker(3), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill', config:{pos: intel.importantPlaces.drillSpots[i].sites[0]  }});
          army.push({chassis: chassis.transporter(3), name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'harvest', source: "F", destination: "Sr"} }); 
        }

        for(var i=0; i<1; i++) { 
            var pumperName = 'HeavyWorker'+(heavyWorkerId++);
            army.push({chassis: chassis.largestWorker(intel.maxEnergy), name: pumperName, role: 'pumper.immobile', config: {maxAge: 200}});
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName, routeU: "route1", routeL: "route2"} }); 
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName, routeU: "route1", routeL: "route2"} }); 
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName, routeU: "route1", routeL: "route2"} }); 
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName, routeU: "route1", routeL: "route2"} }); 
        }
        
        //for(var index in intel.farSources) {
        //    var source = intel.farSources[index];
        //    army.push({chassis: heavyWorker, name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill', config:{sourceId: source.id}});
        //    army.push({chassis: heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker2'});
        //}
        
        
    }
}