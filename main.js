require('registry');
require('betterCreep');
require('locators');

require('conveyor');
require('role.flagPlanter');
require('role.melee');


var harvester = require('harvester');
var builder = require('builder');
var tanker = require('tanker');
var tanker2 = require('tanker2');
var tanker3 = require('tanker3');
var maintainer = require('maintainer');
var tanker4 = require('tanker4');
var drill = require('drill');
var drill2 = require('drill2');
var forklift = require('forklift');
var pumper = require('pumper');
var explorer = require('explorer');

var collectIntel = require('collectIntel');

//require('spawnList');
var intel = collectIntel(Game.spawns.Spawn1);
var stratergy = require('stratergy');

if(!Memory.idCache) Memory.idCache = {};
if(!Memory.stats) Memory.stats = {};
if(!Memory.stats.pumperTravelTime) Memory.stats.pumperTravelTime = [];
if(!Memory.intel) Memory.intel = {};
if(!Memory.memorization) Memory.memorization = {};
if(!Memory.repairJobs) Memory.repairJobs = {};

stratergy(intel);

//console.log("Used "+ Game.getUsedCpu()+" of "+Game.cpuLimit+" CPU already");

for(var name in Game.creeps) {
    //console.log('name', name);
	var creep = Game.creeps[name];
	var pre = Game.getUsedCpu()
	doCreep(creep);
	var post = Game.getUsedCpu();
	var used = post-pre;
	if(used > 2) {
	    //console.log(name, 'used', used);
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
        creep[creep.role](intel);
    }

    if(creep.memory.role == 'guard') {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    	if(targets.length) {
    		creep.moveTo(targets[0]);
    		creep.attack(targets[0]);
    	}
    }
    
	if(creep.memory.role == 'harvester') {
		harvester(creep);
	}
	
	if(creep.memory.role == 'tanker') {
		tanker(creep);
	}
	
	if(creep.memory.role == 'tanker2') {
		tanker2(creep);
	}
	
	if(creep.memory.role == 'tanker3') {
		tanker3(creep);
	}
	
	if(creep.memory.role == 'tanker4') {
		tanker4(creep);
	}
	
	if(creep.memory.role == 'drill') {
		drill(creep);
	}
	
	if(creep.memory.role == 'drill2') {
		drill2(creep);
	}
	
	if(creep.memory.role == 'builder') builder.buildMobile(creep);
	if(creep.memory.role == 'builder.static') builder.buildStatic(creep);
	
	
	if(creep.memory.role == 'forklift') {
		forklift(creep);
	}
	
	if(creep.memory.role == 'pumper' || creep.memory.role == 'pumper.static') {
		pumper.static(creep);
	}
	
	if(creep.memory.role == 'pumper.mobile') {
		pumper.mobile(creep);
	}
	
	if(creep.memory.role == 'roadBuilder') 	require('roadBuilder')(creep);
	if(creep.memory.role == 'park') 	require('park')(creep);
	
	if(creep.memory.role == 'maintainer') 	require('maintainer')(creep, intel);
	
	if(creep.memory.role == 'explorer') explorer(creep, intel);
}

require('statManager')();