var chassis = require('chassis');

module.exports = {
    applyLevelFour: applyLevelFour
};

function upgradeToLevelFour(spawn) {
    //console.log('Upgrade');
    spawn.room.createConstructionSite(spawn.pos.x, spawn.pos.y+1, STRUCTURE_ROAD);
    spawn.room.createConstructionSite(spawn.pos.x, spawn.pos.y+2, STRUCTURE_ROAD);
    spawn.room.createConstructionSite(spawn.pos.x, spawn.pos.y+3, STRUCTURE_ROAD);
    for(var x=1; x<=5; x++) {
        spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+2, STRUCTURE_EXTENSION);
        spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+3, STRUCTURE_ROAD);
        spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+4, STRUCTURE_EXTENSION);
    }

    Memory.stratergy.level = 4;
}

function applyLevelFour(spawn, intel, army) {

    if(Memory.stratergy.level < 4) upgradeToLevelFour(spawn);
    
    var stats = {};
    var workerId=1;
    var maintainerId=1;

    army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        
        
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
        army.push({chassis: chassis.agileWorker, name: 'Builder1', role: 'builder', config: {industry: 'construction', useClosestEnergy: true}});
        army.push({chassis: chassis.agileWorker, name: 'Builder2', role: 'builder', config: {industry: 'construction', useClosestEnergy: true}});
    }

}
