var chassis = require('chassis');

module.exports = {
    applyStrategy: upgradeToLevelSix,
    applyInfrastructure: upgradeToLevelSix
};


function upgradeToLevelSix(spawn) {
    var roads = [];
    
    roads.push([spawn.pos.x, spawn.pos.y+7]);
    roads.push([spawn.pos.x, spawn.pos.y+8]);
    roads.push([spawn.pos.x, spawn.pos.y+9]);
    
    for(var x=1; x<=5; x++) {
        spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+8, STRUCTURE_EXTENSION);
        roads.push([spawn.pos.x-x, spawn.pos.y+9]);
        spawn.room.createConstructionSite(spawn.pos.x-x, spawn.pos.y+10, STRUCTURE_EXTENSION);
    }
    
    spawn.room.memory.roads5 = roads;
}

function upgradeToLevelSix(spawn, intel, army) {

    
}

