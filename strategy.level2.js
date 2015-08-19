module.exports = {
    applyStrategy: applyLevelTwo
};
 
function upgradeToLevelTwo(spawn) {
    //console.log('Upgrade');
    spawn.room.createConstructionSite(spawn.pos.x-1, spawn.pos.y-1, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-2, spawn.pos.y-1, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-2, spawn.pos.y, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-2, spawn.pos.y+1, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-1, spawn.pos.y+1, STRUCTURE_EXTENSION);
   
    Memory.stratergy[spawn.name].level = 2;
}

function applyLevelTwo(spawn, intel, army) {

    if(Memory.stratergy[spawn.name].level == 1) upgradeToLevelTwo(spawn);
    
    var stats = {};
    var workerId=1;
    
    if(intel.progressLevel < 2.2) {
        var builderCount = 0;
        var reserves = Memory.intel.reserves;
        if (reserves > 0.2) builderCount++;
        if (reserves > 0.8) builderCount++;
        if (reserves > 0.99) builderCount++;
        var havesterCount = 7-builderCount;
        
        Memory.stats.havesterCount = havesterCount;
        Memory.stats.builderCount = builderCount;
        
        for(var i=0; i<havesterCount; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester'});
        for(var i=0; i<builderCount; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
    } else {
        var extensions = _.filter(intel.structures, function(x) { return x.structureType === STRUCTURE_EXTENSION;});
        var ids = _.map(extensions, function(x){return x.id;});
        ids = ids.join(';');
        //console.log('ids', ids)
        //army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester'});
        //army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester'});
        //army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'tanker3', config: { source: spawn.id, destination: ids} );
        army.push({chassis: chassis.transporter(3), name: 'Maintainer'+(maintainerId++), role: 'maintainer'});
        //** Does maintainer work here in place of tanker3?
        
        /*
        army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester'});
        for(var index in intel.farSources) {
            var source = intel.farSources[index];
            for(var i=0; i<2; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester', config: {sourceId: source.id}});
        }
        */
        //for(var i=0; i<2; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'pumper.mobile'});
       
        
        var heavyWorkerId = 1;
        var heavyTransportId = 1;
        
        for(var i=0; i<2; i++) { 
          army.push({chassis: chassis.staticWorker(6), name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
          army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker2'});
        }
        
        for(var i=0; i<1; i++) { 
            var pumperName = 'HeavyWorker'+(heavyWorkerId++);
            army.push({chassis: chassis.largestWorker(Memory.intel.maxEnergy), name: pumperName, role: 'pumper.static'});
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "S:Spawn1", destination: "R:"+pumperName} }); 
            army.push({chassis: chassis.heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "S:Spawn1", destination: "R:"+pumperName} });
        }
        
        //for(var index in intel.farSources) {
        //    var source = intel.farSources[index];
        //    army.push({chassis: heavyWorker, name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill', config:{sourceId: source.id}});
        //    army.push({chassis: heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker2'});
        //}
        
        var reserves = Memory.intel.reserves;
        if(reserves == 1) {
            army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
            army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
        }
    }
}