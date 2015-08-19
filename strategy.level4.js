var chassis = require('chassis');

module.exports = {
    applyStrategy: applyLevelFour
};

function upgradeToLevelFour(spawn) {
    var roads = [];
    
    //console.log('Upgrade');
    //spawn.room.createConstructionSite(spawn.pos.x, spawn.pos.y+1, STRUCTURE_ROAD);
    //spawn.room.createConstructionSite(spawn.pos.x, spawn.pos.y+2, STRUCTURE_ROAD);
    //spawn.room.createConstructionSite(spawn.pos.x, spawn.pos.y+3, STRUCTURE_ROAD);
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
    
    for(var i in roads) {
        var road = roads[i];
        //spawn.room.createFlag(road[0], road[1], 'TFLAG'+i);
    }
    
    roads = _.uniq(roads, function(x) {
        return x[0]+':'+x[1];
    });

    Memory.stratergy.roads = roads;
    Memory.stratergy.level = 4;
}

function applyLevelFour(spawn, intel, army) {

    if(Memory.stratergy.level < 4) upgradeToLevelFour(spawn);
    
    var stats = {};
    var workerId=1;
    var maintainerId=1;

    army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
    //army.push({chassis: {parts: [MOVE], cost: 50}, name: 'trash', role: 'park', config: {maxAge: 200, flag: 'TerraNova'}});
        
        
    var heavyWorkerId = 1;
    var lightTransport = 1;
    var heavyTransportId = 1;
    var pumperId = 1;
    
    if(!spawn.storage) {
    
        for(var i=0; i<2; i++) { 
            army.push({chassis: chassis.staticWorker(6, false), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
        }
        army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker2'});
        heavyTransportId++;//army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'park'});
        
        for(var i=0; i<2; i++) {
            var builderName = 'HeavyWorker'+(heavyWorkerId++);
            army.push({chassis: chassis.heavyWorker, name: builderName, role: 'builder.static'});
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "F", destination: "R:"+builderName} });
        }
    } else {
        for(var i=0; i<2; i++) { 
            army.push({chassis: chassis.staticWorker(6, false), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
        }
        
        army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
        army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'gen', source: "Z", destination: "S:Spawn1"} });
        
        for(var i=0; i<1; i++) {
            var pumperName = 'Pumper'+(pumperId++);
            army.push({chassis: chassis.staticWorker(8, true), name: pumperName, role: 'pumper.static'});
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Z", destination: "R:"+pumperName} }); 
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Z", destination: "R:"+pumperName} });
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "Z", destination: "R:"+pumperName} });
        }
        army.push({chassis: chassis.agileWorker, name: 'Builder1', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        if(Memory.repairJobs > 10) {
            army.push({chassis: chassis.agileWorker, name: 'Builder2', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        }
        
        var forigenFlags = _.filter(Game.flags, function(f){return f.color === COLOR_GREEN});
        
        if(false && forigenFlags) {
            //console.log(forigenFlags[0])
            forigenFlags.forEach(function(flag){
                //for(; i<=3; i++) 
                army.push({chassis: chassis.basicWorker, name: 'EntrepidHarvester', role: 'harvester', config: {industry: 'energy', flag: flag.name}});
            });
        }
        
        if(Game.time % 3 === 0) {
            var roads = Memory.stratergy.roads;
            
            
            var totalHits = 0;
            var roadCount = 0
            var expectedRoads = roads.length;
            
           
            roads.forEach(function(xy){
               var look = spawn.room.lookForAt('structure', xy[0], xy[1]);
               var road = null;
               if(look.length && look[0].structureType == 'road') {
                   road = look[0];
               } else {
                  if(look.length)expectedRoads--
               }
              
               if(road){
                   roadCount++;
                   totalHits += (road.hits / road.hitsMax);
                   
                   if(road.hits < ((road.hitsMax/3)*2) ) {
                       Memory.repairJobs[xy[0]+':'+xy[1]] = {x:xy[0], y:xy[1], t:'road', hits: road.hits};
                   }
               } else {
                   spawn.room.createConstructionSite(xy[0], xy[1], STRUCTURE_ROAD);
               }
            });
            
            Memory.stats.roads = 'There are '+roadCount+' out of '+expectedRoads+'. Their average condition is '+(~~(100*totalHits/roadCount))+'%. Open repair jobs: '+( Object.keys(Memory.repairJobs).length);
        }
    }


}
