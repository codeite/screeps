var chassis = require('chassis');

module.exports = {
    applyStrategy: applyLevelThree,
    applyInfrastructure: upgradeToLevelThree
};

function toRoad(p) {
    return [p.x, p.y];
}
 
function upgradeToLevelThree(spawn) {
    //console.log('Upgrade');
    var roads = [];

    var spawnOrbital = spawn.pos.getAdjacentPositions().map(toRoad);
    roads = roads.concat(spawnOrbital);



    //console.log(spawn.room.intel.importantPlaces.drillSpots)
    for(var index in spawn.room.intel.importantPlaces.drillSpots) {
        var drillSpot = spawn.room.intel.importantPlaces.drillSpots[index];
        var sourcePos = spawn.room.getPositionAt(drillSpot.source.x, drillSpot.source.y);

        route = spawn.room.findPath(spawn.pos, sourcePos, {ignoreCreeps: true}).map(toRoad);
        roads = roads.concat(route);
    }

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
            roads.push([spawn.pos.x-dx, spawn.pos.y]);
            spawn.room.createConstructionSite(spawn.pos.x-dx, spawn.pos.y-1, STRUCTURE_EXTENSION);
            spawn.room.createConstructionSite(spawn.pos.x-dx, spawn.pos.y+1, STRUCTURE_EXTENSION);
        }
    }

    route = spawn.room.findPathCached(spawn.pos, spawn.room.controller.pos, {ignoreCreeps: true});
    //console.log('route.length', route.length);
    
    for(var i in route) {
        roads.push([route[i].x, route[i].y]);
    }

    var controllerOrbital = spawn.room.controller.pos.getAdjacentPositions().map(toRoad);
    roads = roads.concat(controllerOrbital);

    if(Game.flags[spawn.room.name+'-TransitPoint']) {
        var transitPointOrbital = Game.flags[spawn.room.name+'-TransitPoint'].pos.getAdjacentPositions().map(toRoad);
        roads = roads.concat(transitPointOrbital);
    }

    spawn.room.memory.roads3 = roads;
}

function applyLevelThree(spawn, intel, army, stratergy) {
   
    if(intel.extensions.length + intel.extensionSites.length < 10) {
        console.log('L3');
        upgradeToLevelThree(spawn);
    }
    
    var stats = {};
    var workerId=1;
    var maintainerId=1;
    

    army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        
        
    var heavyWorkerId = 1;
    var heavyTransportId = 1;
        
    for(var i=0; i<2; i++) { 
      army.push({chassis: chassis.staticWorker(5), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill', config:{pos: intel.importantPlaces.drillSpots[i].sites[0]  }});
      army.push({chassis: chassis.transporter(5), name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'harvest', source: "F", destination: "Sr"} }); 
    }

    if(intel.extensions.length < 10) {
        for(var i=0; i<3; i++) army.push({chassis: chassis.agileWorker, name: 'BasicWorker'+(workerId++), role: 'builder', config:{industry: 'construction', useClosestEnergy: true, maxAge: 0}});

    } else {

        for(var i=0; i<1; i++) { 
            var pumperName = 'HeavyWorker'+(heavyWorkerId++);
            army.push({chassis: chassis.largestWorker(intel.maxEnergy), name: pumperName, role: 'pumper.immobile'});

            if(Game.flags[spawn.room.name+'-TransitPoint']) {

                army.push({chassis: chassis.transitPoint, name: 'transitPoint', role: 'transitPoint', config: {industry: 'pump', pos: Game.flags[spawn.room.name+'-TransitPoint'].pos} }); 
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:transitPoint"} }); 
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "R:transitPoint", destination: "R:"+pumperName} }); 
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "R:transitPoint", destination: "R:"+pumperName} }); 
            } else {
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName} }); 
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:"+pumperName} });
            }
        }

        var reserves = intel.reserves;
        if(reserves == 1 && intel.constructionSites.length > 0) {
            army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder', config:{ buildSource: spawn.room.name+'-TransitPoint'}});
            army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder', config:{ buildSource: spawn.room.name+'-TransitPoint'}});
        }
    }
}