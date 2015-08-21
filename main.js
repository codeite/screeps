initMemory();
//console.log('Tick:', Game.time);
require('registry');
require('betterCreep');
require('caching');
require('locators');

require('conveyor');
require('role.flagPlanter');
require('role.melee');
require('role.transitPoint');
require('role.drill');
require('role.builder');

var harvester = require('harvester');
var builder = require('builder');
var tanker = require('tanker');

var tanker3 = require('tanker3');
var maintainer = require('maintainer');
var tanker4 = require('tanker4');

var forklift = require('forklift');
var pumper = require('pumper');
var explorer = require('explorer');

var collectIntel = require('collectIntel');

//require('spawnList');

var strategy = require('strategy');

for(var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    var intel = collectIntel(spawn);
    spawn.room.intel = intel;
    strategy(spawn, spawn.room.intel);
}

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
    
    if(creep.memory.role == 'harvester') {
        return harvester(creep, intel);
    }
  
    if(creep.memory.role == 'tanker') {
        return tanker(creep);
    }
    
    if(creep.memory.role == 'tanker3') {
        return tanker3(creep);
    }
    
    if(creep.memory.role == 'tanker4') {
        return tanker4(creep);
    }  
    
    if(creep.memory.role == 'forklift') {
        return forklift(creep);
    }
    
    if(creep.memory.role == 'pumper' || creep.memory.role == 'pumper.immobile') {
        return pumper.immobile(creep);
    }
    
    if(creep.memory.role == 'pumper.mobile') {
        return pumper.mobile(creep);
    }
    
    if(creep.memory.role == 'roadBuilder')   return require('roadBuilder')(creep);
    if(creep.memory.role == 'park')   return require('park')(creep);
    
    if(creep.memory.role == 'maintainer')   return require('maintainer')(creep, creep.room.intel);
    
    if(creep.memory.role == 'explorer') return explorer(creep, creep.room.intel);

    console.log('*****', creep, 'Unknown role:', creep.memory.role);
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
    })
}

for(var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    require('statManager')(spawn.room);
}

