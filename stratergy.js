var collectIntel = require('collectIntel');

var basicWorker = {parts: [MOVE, CARRY, WORK], cost: 200};
var heavyWorker = {parts: [MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK], cost: 550};
var heavyTransport = {parts: [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], cost: 500};

function createChassis(spawn, energy, chassis, name, role, config) {
    
    if(Game.creeps[name]) {
        Game.creeps[name].memory.role = role;
        Game.creeps[name].memory.config = config;
        return {existing: 1, energy: 0};
    }
    
    //console.log('Need: ', chassis.cost, 'have: ', energy);
    if(energy >= chassis.cost) {
        var res = spawn.createCreep(chassis.parts, name, {role: role, config: config});
        console.log('Created', name, res);
        return {existing: 0, energy: chassis.cost};
    }
    
    return {existing: 0, energy: 0};
}

function maintainArmy(spawn, army, intel) {
    var energy = intel.totalEnergy;
    //console.log('intel.totalEnergy', intel.totalEnergy);
    
    if(intel.stats) {
        for(var k in intel.stats) delete intel.stats[k];
    } else {
        intel.stats = {};
    }
    var stats = intel.stats;
    var inService = 0;
    
    for(var i=0; i<army.length; i++) {
        var blueprint = army[i];
        var res = createChassis(spawn, energy, blueprint.chassis, blueprint.name, blueprint.role, blueprint.config);
        energy -= res.energy;
        inService += res.existing;
        
        if(stats) {
            if(stats[blueprint.role]) {
                stats[blueprint.role]++;
            } else {
                stats[blueprint.role] = 1;
            }
        }
    }
    
    Memory.stats.army= 'Army size:'+ army.length+ " inService:"+inService+" missing:"+ (army.length - inService);
    //console.log('army',_.map(army, function(x){return x.name;}));
}

function applyLevelOne(spawn, intel) {
    
    // Get to 6 Basic workers. 3 Harvest, 3 Pump
    var army = [];
    var i=1;
    for(; i<=3; i++) army.push({chassis: basicWorker, name: 'BasicWorker'+i, role: 'harvester', config: {industry: 'energy'}});
    for(; i<=6; i++) army.push({chassis: basicWorker, name: 'BasicWorker'+i, role: 'pumper.mobile', config: {industry: 'pump'}});
    
    maintainArmy(spawn, army, intel);
}

function upgradeToLevelTwo(spawn) {
    //console.log('Upgrade');
    spawn.room.createConstructionSite(spawn.pos.x-1, spawn.pos.y-1, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-2, spawn.pos.y-1, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-2, spawn.pos.y, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-2, spawn.pos.y+1, STRUCTURE_EXTENSION);
    spawn.room.createConstructionSite(spawn.pos.x-1, spawn.pos.y+1, STRUCTURE_EXTENSION);
   
    Memory.stratergy.level = 2;
}

function applyLevelTwo(spawn, intel) {

    if(Memory.stratergy.level == 1) upgradeToLevelTwo(spawn);
    
    var army = [], stats = {};
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
        
        for(var i=0; i<havesterCount; i++) army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester'});
        for(var i=0; i<builderCount; i++) army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
    } else {
        var extensions = _.filter(intel.structures, function(x) { return x.structureType === STRUCTURE_EXTENSION;});
        var ids = _.map(extensions, function(x){return x.id;});
        ids = ids.join(';');
        //console.log('ids', ids)
        army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'tanker3', config: { source: spawn.id, destination: ids} });
        
        /*
        army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester'});
        for(var index in intel.farSources) {
            var source = intel.farSources[index];
            for(var i=0; i<2; i++) army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'harvester', config: {sourceId: source.id}});
        }
        */
        //for(var i=0; i<2; i++) army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'pumper.mobile'});
       
        
        var heavyWorkerId = 1;
        var heavyTransportId = 1;
        
        for(var i=0; i<2; i++) { 
          army.push({chassis: heavyWorker, name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill'});
          army.push({chassis: heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker2'});
        }
         
        for(var i=0; i<1; i++) { 
            var pumperName = 'HeavyWorker'+(heavyWorkerId++);
            army.push({chassis: heavyWorker, name: pumperName, role: 'pumper.static'});
            army.push({chassis: heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "S:Spawn1", destination: "C:"+pumperName} }); 
            army.push({chassis: heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker4', config: {industry: 'pump', source: "S:Spawn1", destination: "C:"+pumperName} });
        }
        
        //for(var index in intel.farSources) {
        //    var source = intel.farSources[index];
        //    army.push({chassis: heavyWorker, name: 'HeavyWorker'+(heavyWorkerId++), role: 'drill', config:{sourceId: source.id}});
        //    army.push({chassis: heavyTransport, name: 'HeavyTransport'+(heavyTransportId++), role: 'tanker2'});
        //}
        
        var reserves = Memory.intel.reserves;
        if(reserves > 0.9) {
            army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
        }
        if(reserves > 0.99) {
            army.push({chassis: basicWorker, name: 'BasicWorker'+(workerId++), role: 'builder'});
        }
    }
    
    maintainArmy(spawn, army, intel);
}

module.exports = function() {
    var spawn = Game.spawns.Spawn1;
    var intel = collectIntel(spawn);
    if(!Memory.stratergy) {
        Memory.stratergy = {
            level: intel.progressLevel,
            pump: true,
            build: true
        };
    }
    
    if(!Memory.stats) Memory.stats = {};
    
    if(intel.controllerLevel === 1) {
        applyLevelOne(spawn, intel);
    } else if(intel.controllerLevel === 2) {
        applyLevelTwo(spawn, intel);
    } else {
        console.log('Run out of stratergy!');
    }
    
    
}
