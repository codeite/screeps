var chassis = require('chassis');

module.exports = {
    maintainArmy: maintainArmy
};

function createChassis(spawn, energyAvailable, chassis, name, role, config) {
    
    var creep = Game.registry.getCreep(name);
    
    if(creep) {
        creep.memory.role = role;
        creep.memory.config = config;
        return {existing: 1, energyUsed: 0, energyNeeded: 0, creep: creep};
    }
    
    //console.log('Need: ', chassis.cost, 'have: ', energy);
    if(energyAvailable >= chassis.cost) {
        var creepName = Game.registry.generateName(name);
        var res = spawn.createCreep(chassis.parts, creepName, {role: role, config: config});
        console.log('created: ',res);
        if(typeof res !== 'number') {
            Game.registry.registerOnDeath(name, creepName);
            console.log('Created', name, '('+creepName+')', res);
            return {existing: 0, energyUsed: chassis.cost, energyNeeded: 0};
        }
    } 
    
    return {existing: 0, energyUsed: 0, energyNeeded: chassis.cost};
}

function maintainArmy(spawn, army, intel) {
    var energy = intel.totalEnergy;
    var energyNeeded = 0;
    //console.log('intel.totalEnergy', intel.totalEnergy);
    
    if(intel.stats) {
        for(var k in intel.stats) delete intel.stats[k];
    } else {
        intel.stats = {};
    }
    var stats = intel.stats;
    var inService = 0, armyCost = 0;
    var oldest = null;
    
    for(var i=0; i<army.length; i++) {
        var blueprint = army[i];
        var res = createChassis(spawn, energy, blueprint.chassis, blueprint.name, blueprint.role, blueprint.config);
        energy -= res.energyUsed;
        inService += res.existing;
        energyNeeded += res.energyNeeded;
        armyCost += blueprint.chassis.cost;
        
        if(res.creep) {
            if(!oldest || res.creep.ticksToLive < oldest.ticksToLive) {
                oldest = res.creep;
            }
        }
        
        
        if(stats) {
            if(stats[blueprint.role]) {
                stats[blueprint.role]++;
            } else {
                stats[blueprint.role] = 1;
            }
        }
    }
    
    Memory.stats.energyNeededForArmy = energyNeeded;
    Memory.stats.army= 'Army size:'+ army.length+ " inService:"+inService+" missing:"+ (army.length - inService) + ' Energy needed:'+energyNeeded+
      ' Army cost:' + armyCost + ' (about '+(Math.floor(armyCost/25))+' per minute)';
      
    if(oldest) {
        Memory.stats.army += ' Oldest creep: ' + oldest.name + ' (ttl: '+oldest.ticksToLive +')';
    }
    //console.log('army',_.map(army, function(x){return x.name;}));
}
