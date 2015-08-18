var chassis = require('chassis');

module.exports = {
    applyLevelFive: applyLevelFive
};

function upgradeToLevelFive(spawn) {
    var roads = [];
    
    roads.push([spawn.pos.x, spawn.pos.y+4]);
    roads.push([spawn.pos.x, spawn.pos.y+5]);
    roads.push([spawn.pos.x, spawn.pos.y+6]);
    
    for(var x=1; x<=5; x++) {
        spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+5, STRUCTURE_EXTENSION);
        roads.push([spawn.pos.x-x, spawn.pos.y+6]);
        spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+7, STRUCTURE_EXTENSION);
    }
    
    Memory.stratergy.roads5 = roads;
    Memory.stratergy.level = 5;
}

function applyLevelFive(spawn, intel, army) {

    if(Memory.stratergy.level < 5) upgradeToLevelFive(spawn);
    
    var stats = {};
    var workerId=1;
    var maintainerId=1;
    var heavyWorkerId = 1;
    var lightTransport = 1;
    var heavyTransportId = 1;
    var pumperId = 1;
    
    army.push({chassis: chassis.transporter(4), name: 'lightTransport'+(lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "Z", destination: "S:Spawn1"} });
    army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        
    if(false) {
       buildLinks(spawn, intel, army);
    } else {
        if(intel.importantPlaces.sourceAndStorage) {
            for(var i=0; i<intel.importantPlaces.sourceAndStorage.length; i++){
                var pos = intel.importantPlaces.sourceAndStorage[i];
                army.push({chassis: chassis.staticWorker(6, true), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill', config:{pos: pos}});
            }
            army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
        } else {
            army.push({chassis: chassis.staticWorker(6, true), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
            army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
            army.push({chassis: chassis.staticWorker(6, true), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
        }
        
    
        army.push({chassis: chassis.rov, name: 'rov1', role: 'flagPlanter', config: {industry: 'military', flag: "HoldingFlag1", roomName:"W9N8"} });
            
        //army.push({chassis: chassis.ram, name: 'ram', role: 'melee', config: {industry: 'military', flag: "AttackFlag1", roomName:"W9N8"} });
        
        
        if(intel.importantPlaces.controllerAndRx) {
            var positions= intel.importantPlaces.controllerAndRx;
            for(var i=0; i<positions.length && i<1; i++) {
                var pumperName = 'Pumper'+(pumperId++);
                if(Game.spawns.Spawn2)
                    army.push({chassis: chassis.largestWorker(intel.maxEnergy), name: pumperName, role: 'pumper.static', config:{pos: positions[i]}});
            }
        } 
        army.push({chassis: chassis.agileWorker, name: 'Builder1', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        if(Memory.repairJobs > 10 || intel.constructionSites.length > 0) {
            army.push({chassis: chassis.agileWorker, name: 'Builder2', role: 'builder', config: {industry: 'construction', useClosestEnergy: true, maxAge: 0}});
        }
        
        army.push({chassis: chassis.transporter(1), name: 'lightTransport'+(lightTransport++), role: 'conveyor', config: {industry: 'pump', pos: intel.importantPlaces.storageAndTx[0], source: "Z", destination: "L:nearestTo:Z"} });
    
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

function buildLinks(spawn, intel, army) {
    for(var i=0; i<2; i++) { 
        army.push({chassis: chassis.staticWorker(6, true), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
    }
    army.push({chassis: chassis.lightTransport, name: 'lightTransport'+(lightTransport++), role: 'tanker4', config: {industry: 'gen', source: "F", destination: "Z"} });
    
    for(var i=0; i<1; i++) {
        var builderName = 'HeavyWorker'+(heavyWorkerId++);
        army.push({chassis: chassis.heavyWorker, name: builderName, role: 'builder.static'});
        army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'build', source: "Z", destination: "R:"+builderName} });
    }
}

