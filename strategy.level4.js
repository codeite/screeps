var chassis = require('chassis');

module.exports = {
    applyStrategy: applyLevelFour,
    applyInfrastructure: upgradeToLevelFour
};

function toRoad(p) {
    return [p.x, p.y];
}

function upgradeToLevelFour(spawn, intel) {
    var roads = [];
    
    
    if(spawn.room.name == 'W9N8') {
        var n = 1;
        for(var dy=2; dy<=11; dy++) {
            roads.push([spawn.pos.x-1, spawn.pos.y-dy]);
            
            for(var dx=0; dx<=2; dx+=2) {
                var y = spawn.pos.y-dy;
                var xRoad = spawn.pos.x+((dy+1)%2)+dx;
                var xExt = spawn.pos.x+(dy%2)+dx;

                roads.push([xRoad, y]);
                spawn.room.createConstructionSite(xExt, y, STRUCTURE_EXTENSION);
                
                /*
                var name = 'e-'+(n);
                if(Game.flags[name])Game.flags[name].remove();
                var res = spawn.room.createFlag(xExt, y,  name, COLOR_PURPLE);

                var name = 'r-'+(n);
                if(Game.flags[name])Game.flags[name].remove();
                var res = spawn.room.createFlag(xRoad, y,  name, COLOR_GREY);
                //console.log(res
                n++ 
                */           }
        }
    } else {
        roads.push([spawn.pos.x, spawn.pos.y+1]);
        roads.push([spawn.pos.x, spawn.pos.y+2]);
        roads.push([spawn.pos.x, spawn.pos.y+3]);
        
        for(var x=1; x<=5; x++) {
            spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+2, STRUCTURE_EXTENSION);
            //spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+3, STRUCTURE_ROAD);
            roads.push([spawn.pos.x-x, spawn.pos.y+3]);
            roads.push([spawn.pos.x-x, spawn.pos.y]);
            spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+4, STRUCTURE_EXTENSION);
        }
    }
    
    if(spawn.room.storage) {
        var route = spawn.room.findPath(spawn.pos, spawn.room.storage.pos, {ignoreCreeps: true});
        //console.log('route.length', route.length);
        
        for(var i in route) {
            roads.push([route[i].x, route[i].y]);
        }
    
   
        route = spawn.room.findPath(spawn.room.storage.pos, spawn.room.controller.pos, {ignoreCreeps: true});
        //console.log('route.length', route.length);
        
        for(var i in route) {
            roads.push([route[i].x, route[i].y]);
        }

        var storageOrbital = spawn.room.storage.pos.getAdjacentPositions().map(toRoad);
        roads = roads.concat(storageOrbital);

    }
    
    for(var i in roads) {
        var road = roads[i];
        //spawn.room.createFlag(road[0], road[1], 'TFLAG'+i);
    }
    
    roads = _.uniq(roads, function(x) {
        return x[0]+':'+x[1];
    });

    spawn.room.memory.roads4 = roads;
}

function applyLevelFour(spawn, intel, army) {


    //if(intel.extensions.length + intel.extensionSites.length < 20) {
        upgradeToLevelFour(spawn, intel);
    //}

    var stats = {};
    var workerId=1;
    var maintainerId=1;

    var emergency = false;
    if(emergency) {
        for(var i=0; i<2; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester', config: {industry: 'energy', pos: intel.energySites[(i-1)%intel.energySites.length]}});
    }

    army.push({chassis: chassis.transporter(2), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        
    var ids = {
        heavyWorkerId: 1,
        lightTransport: 1,
        heavyTransportId: 1,
        pumperId: 1
    };
    
    if(!spawn.room.storage) {
        buildStorage(ids);
        
    } else {
        for(var i=0; i<intel.importantPlaces.drillSpots.length; i++) { 
            army.push({chassis: chassis.staticWorker(5, false), name: 'HeavyWorker'+(ids.heavyWorkerId++), role: 'drill', config:{pos: intel.importantPlaces.drillSpots[i].sites[0]  }});
        }
        
        army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
        army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
        army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "Z", destination: "Sr"} });
        
        if(spawn.room.memory.strategy.buildPumpCreeps) {
            for(var i=0; i<1; i++) {
                var pumperName = 'Pumper'+(ids.pumperId++);
                var source = "Z";
                if(Game.flags[spawn.room.name+'-TransitPoint'])
                    source = 'R:transitPoint'
                army.push({chassis: chassis.staticWorker(8, true), name: pumperName, role: 'pumper.immobile'});
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(ids.heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: source, destination: "R:"+pumperName} });
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(ids.heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: source, destination: "R:"+pumperName} });
                army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(ids.heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: source, destination: "R:"+pumperName} });
            }
        }
        army.push({chassis: chassis.agileWorker, name: 'Builder1', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        if(Memory.repairJobs > 10) {
            army.push({chassis: chassis.agileWorker, name: 'Builder2', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        }
        
    }

    if(Game.flags[spawn.room.name+'-TransitPoint']) {

        army.push({chassis: chassis.transitPoint, name: 'transitPoint', role: 'transitPoint', config: {industry: 'pump', pos: Game.flags[spawn.room.name+'-TransitPoint'].pos} }); 
        army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(ids.heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Sr", destination: "R:transitPoint"} }); 
    }


    if(spawn.room.memory.stats.averageCondition < 0.5) {
        army.push({chassis: chassis.agileWorker, name: 'Upkeep1', role: 'upkeep', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0, priorityMainanence: true}});
    }


}

function buildStorage(ids) {
    console.log('Building storage');
    for(var i=0; i<2; i++) { 
      army.push({chassis: chassis.staticWorker(5), name: 'HeavyWorker'+(ids.heavyWorkerId++), role: 'drill', config:{pos: intel.importantPlaces.drillSpots[i].sites[0]  }});
      army.push({chassis: chassis.transporter(5), name: 'HeavyTransport'+(ids.heavyTransportId++), role: 'tanker4', config: {industry: 'harvest', source: "F", destination: "Sr"} }); 
    }

    for(var i=0; i<2; i++) {
        var builderName = 'HeavyWorker'+(ids.heavyWorkerId++);
        army.push({chassis: chassis.heavyWorker, name: builderName, role: 'staticBuilder'});
         
         var source = 'F';
         //if(Game.flags[spawn.room.name+'-TransitPoint'])
         //   source = 'R:transitPoint'
        army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(ids.heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: source, destination: "R:"+builderName} });
    }
}