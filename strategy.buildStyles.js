
module.exports = {
    planExtensionRows: planExtensionRows
};

function planExtensionRows(spawn, factory, currentLimits) {
    var maxExtensions = Math.min(currentLimits[STRUCTURE_EXTENSION], 50);
    var rows = Math.ceil(maxExtensions/10);
    //console.log('rows: ', rows, JSON.stringify(currentLimits));
    for(var row = 0; row < rows; row++){
        var y = row * 3;
        factory.createPermanentConstruction(spawn.pos.x-1, spawn.pos.y+y-1, STRUCTURE_ROAD);
        factory.createPermanentConstruction(spawn.pos.x-1, spawn.pos.y+y, STRUCTURE_ROAD);
        factory.createPermanentConstruction(spawn.pos.x-1, spawn.pos.y+y+1, STRUCTURE_ROAD);
        
        for(var x=2; x<=6; x++) {
            
            factory.createPermanentConstruction(spawn.pos.x-x, spawn.pos.y+y-1, STRUCTURE_EXTENSION);
            factory.createPermanentConstruction(spawn.pos.x-x, spawn.pos.y+y, STRUCTURE_ROAD);
            factory.createPermanentConstruction(spawn.pos.x-x, spawn.pos.y+y+1, STRUCTURE_EXTENSION);
        }
        factory.createPermanentConstruction(spawn.pos.x-7, spawn.pos.y+y-1, STRUCTURE_ROAD);
        factory.createPermanentConstruction(spawn.pos.x-7, spawn.pos.y+y, STRUCTURE_ROAD);
        factory.createPermanentConstruction(spawn.pos.x-7, spawn.pos.y+y+1, STRUCTURE_ROAD);
    }
}

function planExtensionCheckerBoard(spawn, factory, currentLimits) {
    var maxExtensions = Math.min(currentLimits[STRUCTURE_EXTENSION], 50);
    var n = 1;
    for(var dy=2; dy<=11; dy++) {
        roads.push([spawn.pos.x-1, spawn.pos.y-dy]);
        
        for(var dx=0; dx<=4; dx+=2) {
            var y = spawn.pos.y-dy;
            var xRoad = spawn.pos.x+((dy+1)%2)+dx;
            var xExt = spawn.pos.x+(dy%2)+dx;

            roads.push([xRoad, y]);
            spawn.room.createConstructionSite(xExt, y, STRUCTURE_EXTENSION);
            
            /*
            var name = 'e-'+(n);
            if(Game.flags[name])Game.flags[name].remove();
            var res = spawn.room.createFlag(xExt, y,  name, COLOR_PURPLE);

            var name = 'r-'+(n);
            if(Game.flags[name])Game.flags[name].remove();
            var res = spawn.room.createFlag(xRoad, y,  name, COLOR_GREY);
            //console.log(res
            n++ 
            */           
        }
    }
}
