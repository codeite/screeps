var chassis = require('chassis');

module.exports = {
    maintainArmy: maintainArmy
};

function createChassis(spawn, energyAvailable, chassis, name, role, config) {
    
    var creep = Game.registry.getCreep(name);
    
    if(creep) {
        var maxAge = (config && config['maxAge']) || 100;
        creep.memory.role = role;
        creep.memory.config = config;
        if(maxAge) {
            //console.log('creep.memory.replacement', creep.memory.replacement);
            if(creep.ticksToLive > maxAge || creep.memory.replacement) {
            
                return {existing: 1, energyUsed: 0, energyNeeded: 0, creep: creep};
            }
        } else {
             return {existing: 1, energyUsed: 0, energyNeeded: 0, creep: creep};
        }
    }
    
    //console.log('Need: ', chassis.cost, 'have: ', energy);
    if(energyAvailable >= chassis.cost) {
        var creepName = Game.registry.generateName(name);
        var newCreep = spawn.createCreep(chassis.parts, creepName, {role: role, config: config});
        //console.log('newCreep:', newCreep, newCreep instanceof Creep);
        if(typeof newCreep !== 'number' ) {
            console.log('Created', name, '('+creepName+')', newCreep);
            //newCreep.memory.replacement = null;
            
            var existingCreep = Game.registry.getCreep(name);
            if(existingCreep) {
                console.log('Waiting for existing creep', existingCreep, 'to die');
                existingCreep.memory.replacement = true;
                Game.registry.registerOnDeath(name, creepName);
            } else {
                console.log('No predecesor, jumping right in');
                Game.registry.register(name, creepName);
            }
           
            return {existing: 0, energyUsed: chassis.cost, energyNeeded: 0, creep: null};
        } 
    } 
    
    return {existing: 0, energyUsed: 0, energyNeeded: chassis.cost, creep: null};
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
    var missing = null;

    for(var i=0; i<army.length; i++) {
        var blueprint = army[i];
        var res = createChassis(spawn, energy, blueprint.chassis, spawn.room.name+'-'+blueprint.name, blueprint.role, blueprint.config);
        energy -= res.energyUsed;
        energy -= res.energyNeeded;
        inService += res.existing;
        energyNeeded += res.energyNeeded;
        armyCost += blueprint.chassis.cost;
        blueprint.pos = res.creep && res.creep.pos;

        if(!missing && res.existing === 0 && res.energyUsed === 0) {
            missing = army[i];
        }
        
        if(res.creep) {
            res.creep.memory.owner = spawn.name;
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

    //console.log('spawn.room:',spawn.room.memory);
    var roomStats = spawn.room.memory.stats;
    
    roomStats.energyNeededForArmy = energyNeeded;
    roomStats.army= 'Army size:'+ army.length+ " inService:"+inService+" missing:"+ (army.length - inService) + ' Energy needed:'+energyNeeded+
      ' Army cost:' + armyCost + ' (about '+(Math.floor(armyCost/24))+' per minute)';
      
    if(oldest) {
        roomStats.army += '\nOldest creep: ' + oldest.name + ' (ttl: '+oldest.ticksToLive +')';
    }

    if(missing) {
        roomStats.army += '\nNext missing creep: ' + missing.name + ' ('+missing.role+' '+missing.chassis.name+'=$'+missing.chassis.cost +')';
   
    }
    //console.log('army',_.map(army, function(x){return x.name;}));
}
