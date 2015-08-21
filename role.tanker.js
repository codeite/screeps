module.exports = tanker;

Creep.prototype.tanker = tanker;
Creep.prototype.tanker4 = tanker;

function tanker (intel) {
    var creep = this;
    //creep.say('E'+creep.carry.energy);
    var res = 0;

    
    //console.log('tanker4:', creep.config.industry, Memory.stratergy.pump)
    if(creep.config.industry == 'pump' && Memory.stratergy.pump === false) {
        creep.moveTo(creep.room.rootSpawn);
        creep.transferEnergy(creep.room.rootSpawn);
        //creep.say('pump - off');
        return;
    }
    
    
    var source = creep.getTarget(creep.config.source, creep);
    var destinations = creep.config.destination.split(';');
    var dindex = ~~creep.memory.dindex;
    
    var destination = creep.getTarget(destinations[dindex], creep);
    //console.log('destination', destination, destinations, dindex);
    
    //console.log(dindex, source, destination);
    if(creep.ticksToLive < 100 && creep.carry.energy == 0) {
        creep.suicide();
        return;
    }
    
    if(!creep.memory.mode) {
        creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'U';
            //creep.memory.dindex = (dindex+1)%destinations.length;
        }
    } else if(creep.memory.mode === 'U') {
        if(creep.carry.energy === 0) creep.memory.mode = 'L';
    }
    
    if(creep.memory.mode === 'L') {
        creep.moveTo(source, {reusePath: 20});
        if(source && source.transferEnergy) res = source.transferEnergy(creep);
        if(source instanceof Energy) {
            res = creep.pickup(source);
            //console.log('energy:', source.energy);
            if(source.energy < 10) {
                var curTarget = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
                    filter: function(object) {
                        return object.id != source.id;
                    }
                });
                if(curTarget) creep.memory.target = curTarget.id;
            }
        }
        
        if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'U';
            //creep.memory.dindex = (dindex+1)%destinations.length;
        } else if(!source) {
            //creep.say('No src');
            //creep.moveTo(Game.flags.Park);
        }
        
    }
    
    if(creep.memory.mode === 'U') {
        //console.log(creep, 'destination:', destination);
        if(destination) {
           
            if(creep.pos.isNearTo(destination)) {
                creep.memory._route = null;

                res = creep.transferEnergy(destination);
                
                if(res == ERR_FULL) {
                    //console.log('creep.memory.dindex1', creep.memory.dindex);
                    
                     creep.memory.dindex = ((~~(creep.memory.dindex))+1)%(destinations.length);
                    //console.log('creep.memory.dindex2', creep.memory.dindex);
                }
            } else {
                if(creep.config.routeU) {
                    if(!creep.memory._route) {
                        creep.memory._route = creep.room.getRoute(creep.config.routeU);
                    }

                    if(creep.memory._route) {
                        var route = creep.memory._route;
                        if(!creep.memory._routeStarted) {
                            creep.moveTo(route[0].x, route[0].y);
                            if(creep.pos.x == route[0].x && creep.pos.y == route[0].y) {
                                creep.memory._routeStarted = true;
                            }
                        } else {
                            if(route.length > 3) {
                                var res = creep.moveByPath(route);
                                if(res === OK && !(route[0].x === creep.pos.x && route[0].y === creep.pos.y) ) {
                                    route.shift();
                                }

                                if(res === ERR_NOT_FOUND) {
                                    creep.memory._route = [];
                                }

                                console.log(creep, route.length, res);
                            } else {
                                creep.moveTo(destination.pos);
                            }
                        }
                    } else {
                        creep.moveTo(destination.pos, {reusePath: 20});
                        res = 't';
                    }
                } else {

                    creep.moveTo(destination.pos, {reusePath: 20});
                    res = 't';
                }
            }
        } else {
            res = 'l';
            creep.say('No Tgt!');
        }
    }

    //creep.say(creep.memory.mode );
    
    //console.log(creep.pos, destination.pos);
    //console.log(creep.memory.dindex+'E'+ creep.carry.energy + 'R'+res+'M'+creep.memory.mode);
}