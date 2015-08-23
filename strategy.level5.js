var chassis = require('chassis');
var infraConvayor = require('infra.convayor');

module.exports = {
    applyStrategy: applyLevelFive,
    applyInfrastructure: upgradeToLevelFive
};

function toRoad(p) {
    return [p.x, p.y];
}

function upgradeToLevelFive(spawn, intel) {
    
    
    var roads = [];
    if(spawn.room.name == 'W9N8') {
        var n = 1;
        for(var dy=2; dy<=11; dy++) {
            roads.push([spawn.pos.x-1, spawn.pos.y-dy]);
            
            for(var dx=0; dx<=4; dx+=2) {
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
    
        roads.push([spawn.pos.x, spawn.pos.y+4]);
        roads.push([spawn.pos.x, spawn.pos.y+5]);
        roads.push([spawn.pos.x, spawn.pos.y+6]);
        
        for(var x=1; x<=5; x++) {
            spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+5, STRUCTURE_EXTENSION);
            roads.push([spawn.pos.x-x, spawn.pos.y+6]);
            spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+7, STRUCTURE_EXTENSION);
        }
    }
    
    if(intel.links && intel.links[0]) {
        roads = roads.concat(intel.links[0].pos.getAdjacentPositions().map(toRoad));
    }
    
    spawn.room.memory.roads5 = roads;
}

function applyLevelFive(spawn, intel, army) {

    
    if(intel.extensions.length + intel.extensionSites.length < 30)
    {
        upgradeToLevelFive(spawn, intel);
    }
    
    var stats = {};
    var ids = {
        workerId: 1,
        maintainerId: 1,
        heavyWorkerId: 1,
        heavyDriller: 1,
        lightTransport: 1,
        heavyTransportId: 1,
        pumperId: 1,
    }
    
    //army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+i, role: 'harvester', config: {industry: 'energy'}});
    
    army.push({chassis: chassis.transporter(4), name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "Z", destination: "Sr"} });
    army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(ids.maintainerId++), role: 'maintainer'});
    
    if(intel.links.length < 2 || intel.extensions.length < 30) {
       buildLinks(spawn, intel, army, ids);
    } else {
        if(intel.importantPlaces.sourceAndStorage && intel.importantPlaces.sourceAndStorage.length) {
            //for(var i=0; i<intel.importantPlaces.sourceAndStorage.length; i++){
                var pos = intel.importantPlaces.sourceAndStorage[0];
                army.push({chassis: chassis.staticWorker(6, true), name: 'HeavyDriller'+(ids.heavyDriller++), role: 'drill', config:{pos: pos}});
            //}
            army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
        } else {
            for(var i=0; i<intel.importantPlaces.drillSpots.length; i++) {
                var drillName = 'HeavyDriller'+(ids.heavyDriller++);
                var site = intel.importantPlaces.drillSpots[i].sites[0];
                army.push({chassis: chassis.staticWorker(6, true), name: drillName, role: 'drill', config:{pos: site }});
                //army.push({chassis: chassis.transporter(3), name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F:on:R:"+drillName, destination: "Z"} });
            

                var source = spawn.room.getPositionAt(site.x, site.y);
                var dest = spawn.room.getTarget('Z').pos;
                //var stg = new Game.Strategy();
                
                var carmy = infraConvayor.buildConvayor(spawn, source, dest, drillName);
                for(var j in carmy) army.push(carmy[j]);
            }
            

        }
        
    
        //army.push({chassis: chassis.rov, name: 'rov1', role: 'flagPlanter', config: {industry: 'military', flag: "HoldingFlag1", roomName:"W9N8"} });
            
        //army.push({chassis: chassis.ram, name: 'ram', role: 'melee', config: {industry: 'military', flag: "AttackFlag1", roomName:"W9N8"} });
        
        if(spawn.room.memory.strategy.buildPumpCreeps) {
            if(intel.importantPlaces.controllerAndRx ) {
                var positions= intel.importantPlaces.controllerAndRx;
                for(var i=0; i<positions.length && i<1; i++) {
                    var pumperName = 'Pumper'+(ids.pumperId++);
                    if(Game.spawns.Spawn2)
                        army.push({chassis: chassis.largestWorker(intel.maxEnergy), name: pumperName, role: 'pumper.immobile', config:{pos: positions[i]}});
                }
            } 
        }
        army.push({chassis: chassis.agileWorker, name: 'Builder1', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        if(Memory.repairJobs > 10 || intel.constructionSites.length > 0) {
            army.push({chassis: chassis.agileWorker, name: 'Builder2', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        }
        
        army.push({chassis: chassis.transporter(1), name: 'lightTransport'+(ids.lightTransport++), role: 'conveyor', config: {industry: 'pump', pos: intel.importantPlaces.storageAndTx[0], source: "Z", destination: "L:nearestTo:Z"} });
    
        var txLink = spawn.txLink;
        var rxLink = spawn.rxLink;
        
        if(txLink && rxLink && txLink != rxLink && txLink.cooldown === 0) {
            //console.log('Good to send', txLink, rxLink);
            
            if((rxLink.energy/rxLink.energyCapacity) < 0.1) {
                txLink.transferEnergy(rxLink)
            }
        } else {
            //console.log('no Good', txLink, rxLink);
        }
    }
}

function buildLinks(spawn, intel, army, ids) {
    //for(var i=0; i<2; i++) { 
    //    army.push({chassis: chassis.staticWorker(6, true), name: 'HeavyWorker'+(ids.heavyWorkerId++), role: 'drill'});
    //}
    //army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
    
    for(var i=0; i<intel.importantPlaces.drillSpots.length; i++) { 
        army.push({chassis: chassis.staticWorker(5, false), name: 'HeavyDriller'+(ids.heavyDriller++), role: 'drill', config:{pos: intel.importantPlaces.drillSpots[i].sites[0]  }});
        army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(ids.lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
    
    }
    
    for(var i=0; i<2; i++) {
        var builderName = 'HeavyWorker'+(ids.heavyWorkerId++);
        army.push({chassis: chassis.heavyWorker, name: builderName, role: 'buildStatic'});
        army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(ids.heavyTransportId++), role: 'tanker4', config: {industry: 'build', source: "Z", destination: "R:"+builderName} });
    }
}

