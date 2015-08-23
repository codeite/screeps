require('js');
initMemory();
//console.log('Tick:', Game.time);
require('registry');
require('betterCreep');
require('caching');
require('locators');

require('role.conveyor');
require('role.flagPlanter');
require('role.melee');
require('role.transitPoint');
require('role.drill');
require('role.builder');
require('role.harvester');
require('role.maintainer');
require('role.park');
require('role.tanker');
require('role.explorer');

var pumper = require('pumper');

var collectIntel = require('intel.collect');

//require('spawnList');

var strategy = require('strategy');
var invasion = require('strategy.invasion');
  
for(var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    var intel = collectIntel(spawn);
    spawn.room.intel = intel;
    strategy(spawn, spawn.room.intel);
}

//invasion.applyInvasion(Game.spawns.Spawn2, spawn.room.intel);

//console.log("Used "+ Game.getUsedCpu()+" of "+Game.cpuLimit+" CPU already");

for(var name in Game.creeps) {
    //console.log('name', name);
    var creep = Game.creeps[name];
    var pre = Game.getUsedCpu()
    doCreep(creep);
    var post = Game.getUsedCpu();
    var used = post-pre;
    if(used > 10) {
        console.log(name, 'used', used);
    }
}

cleanMemory();

function doCreep(creep) {
    
    if(creep.memory.roleOverride) {
        if(creep.memory.roleOverride.ttl <= 0){
            delete creep.memory.roleOverride;
        } else {
            creep.memory.role = creep.memory.roleOverride.role;
            creep.memory.roleOverride.ttl--;
        }
    }
    
    //console.log('Role: ', creep.role, typeof(creep[creep.role]))
    //console.log('Role: ', creep.conv)
    if(typeof(creep[creep.role]) === 'function') {
        return creep[creep.role](creep.room.intel);
    }
    

    
    if(creep.memory.role == 'pumper' || creep.memory.role == 'pumper.immobile') {
        return pumper.immobile(creep);
    }
    
    if(creep.memory.role == 'pumper.mobile') {
        return pumper.mobile(creep);
    }
    

    console.log('*****', creep, 'Unknown role:', creep.memory.role);
}

function cleanMemory() {
    if(Game.time % 60 === 0) {
        for(var creepName in Memory.creeps) {
            if(!Game.creeps[creepName]) delete Memory.creeps[creepName];
        }

        for(var creepTitle in Memory.registry) {
            var creepName = Memory.registry[creepTitle];
            if(!Game.creeps[creepName]) {
                //console.log('Would delete', creepTitle)
                delete Memory.registry[creepTitle];
            } 
        }
    }
}

function initMemory() {
    if(!Memory.idCache) Memory.idCache = {};
    if(!Memory.cache) Memory.cache = {};
    if(!Memory.memorization) Memory.memorization = {};

    var roomNames = Object.keys(Game.rooms);
    roomNames.forEach(function (roomName){
        if(!Memory.rooms[roomName]) Memory.rooms[roomName] = {};
        var roomMem = Memory.rooms[roomName];
      
        if(!roomMem.stats) roomMem.stats = {};
        if(!roomMem.strategy) roomMem.strategy = { level: [], pump: true, build: true };
        if(!roomMem.repairJobs) roomMem.repairJobs = {};
        if(!roomMem.intel) roomMem.intel = {};
        if(!roomMem.routes) roomMem.routes = {};
        if(!roomMem.infrastructure) roomMem.infrastructure = {};

        roomMem.stats.pumped = 0;
    });
}

for(var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    require('statManager')(spawn.room);
}

