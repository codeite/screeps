

var harvester = require('harvester');
var builder = require('builder');
var tanker = require('tanker');
var tanker2 = require('tanker2');
var tanker3 = require('tanker3');
var tanker4 = require('tanker4');
var drill = require('drill');
var drill2 = require('drill2');
var forklift = require('forklift');
var pumper = require('pumper');

//require('spawnList');
var stratergy = require('stratergy');
stratergy();


for(var name in Game.creeps) {
    //console.log('name', name);
	var creep = Game.creeps[name];

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

	if(creep.memory.role == 'builder') {
		builder(creep);
	}
	
	if(creep.memory.role == 'forklift') {
		forklift(creep);
	}
	
	if(creep.memory.role == 'pumper' || creep.memory.role == 'pumper.static') {
		pumper.static(creep);
	}
	
	if(creep.memory.role == 'pumper.mobile') {
		pumper.mobile(creep);
	}
}
