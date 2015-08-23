Creep.prototype.getTarget = getTarget;
RoomPosition.prototype.getTarget = getTarget;
Spawn.prototype.getTarget = getTarget;
Room.prototype.getTarget = getTarget;

Creep.prototype.findPosNextTo = findPosNextTo;
RoomPosition.prototype.findPosNextTo = findPosNextTo;
Spawn.prototype.findPosNextTo = findPosNextTo;

function getTarget(descriptor, memory) {
    var pos, room;
    if(this instanceof Creep){
        room = this.room;
        pos = this.pos;
        memory = this.memory;
    } else if(this instanceof RoomPosition) {
        room = Game.rooms[pos.roomName];
        pos = pos;
        memory = {};
    } else if(this instanceof Spawn) {
        room = this.room;
        pos = this.pos;
        memory = this.memory;
    } else if(this instanceof Room) {
        room = this;
        pos = this.getPositionAt(25, 25);
        memory = this.memory;
    } else {
        throw "Called getTarget on " + typeof(this);
    }
    
    //console.log('this', this);
    var bits = descriptor.betterSplit(':', 3);
    if(bits[0] == 'C') {
        return Game.creeps[room.name+'-'+bits[1]];
    } else if(bits[0] == 'R') {
        var creep = Game.registry.getCreep(room.name+'-'+bits[1]);
        return creep;
    } else if(bits[0] == 'Pc') {
        var rp = room.getPositionAt(bits[1], bits[2]);
        var found = room.lookForAt('creep', rp );
        console.log(room, 'Loooking for creep at:', bits[1], bits[2], 'found:', JSON.stringify(found));
        return found.length?found[0]:null;
    } else if(bits[0] == 'FC') {
        var rp = room.getPositionAt(bits[1], bits[2]);
        var foundE = room.lookForAt('energy', rp );
        if(foundE.length) return foundE[0];
        var foundC = room.lookForAt('creep', rp );
        //console.log(room, 'Loooking for creep at:', bits[1], bits[2], 'found:', JSON.stringify(foundC));
        return foundC.length?foundC[0]:null;
    } else if(bits[0] == 'Ct') {
       return room.controller;
    } else if(bits[0] == 'S') {
        return Game.spawns[bits[1]];
    } else if(bits[0] == 'Sr') {
        return room.rootSpawn;
    } else if(bits[0] == 'I') {
        var bid = Game.getObjectById(bits[1]);
        console.log('bid', bid, bits[1]);
        return bid;
    } else if(bits[0] == 'Z') {
        return room.storage;
    } else if(bits[0] == 'T') {
        return Game.structures[bits[1]];
    } else if(bits[0] == 'F') {
        var curTarget = Game.getObjectById(memory.targetId);

        if(!curTarget && bits[1] === 'on' && bits[2]) {
            var local = this.getTarget(bits[2], memory);

            if(local && local.pos) {
                var found = local.pos.lookFor('energy');
                if(found.length) {
                    curTarget = found[0];
                    memory.targetId = curTarget.id;
                }
            }
        } else if(!curTarget) {
            curTarget = pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(curTarget) memory.targetId = curTarget.id;
        }
        return curTarget;
    } else if(bits[0] == 'L') {
        if(bits[1] === 'nearestTo') {
            var other = this.getTarget(bits[2]);
            if(other) {
                return other.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: {structureType: STRUCTURE_LINK}
                });
            }
            return null;
        } else {
            var links = pos.room.find(FIND_STRUCTURES, {
                filter: {structureType: STRUCTURE_LINK}
            });
            return links[0];
        }
    } else if(bits[0] == 'E') {
        var index = 0;
        if(bits[1] === 'index') {
            index = ~~bits[3];
        }
        
        var found = room.find(FIND_SOURCES)[index];
        //console.log('Locate E', room, found);
        return found;
    } else {
        console.log("**** Confused lookign for ", bits[0], '('+descriptor+')');
    }
};

function findPosNextTo(idA, idB) {

    var a = this.getTarget(idA);
    var b = this.getTarget(idB);
    console.log('findPosNextTo:', idA, idB, a, b);
    
    if(!a || !b) return [];
    var aPos = a.pos;
    var bPos = b.pos;
    
    //return aPos + ' -> '+ bPos;
    
    var validPositions = _.filter(aPos.getAdjacentPositions(), function(aa) {
        return aa.isAdjacentTo(bPos);
    });
    
    validPositions = _.filter(validPositions, function(pos) {
        var found = pos.lookFor('terrain');
        //console.log('pos:', pos, found);
        return found[0] == 'plain';
    });

    validPositions = validPositions.map(function(vp){
        vp.sourceId = a.id;
        vp.destId = b.id;
        return vp;
    })
    
    //return _.map(validPositions, function(n) {return n.x+':'+n.y});
    return validPositions;
};

RoomPosition.prototype.isAdjacentTo = function(other) {
    var dx = Math.abs(this.x - other.x);
    var dy = Math.abs(this.y - other.y);
    
    return dx <= 1 && dy <= 1 && !(dx == 0 && dy == 0);
};

RoomPosition.prototype.getAdjacentPositions = function() {
    var positions = [];
    
    for(var dy = this.y-1; dy<=this.y+1; dy++) {
        for(var dx = this.x-1; dx<=this.x+1; dx++) {
            if (dx >= 0 && dy >=0 && dx < 50 && dy < 50 && !(dx === this.x && dy === this.y)) {
                positions.push(new RoomPosition(dx, dy, this.roomName));
            }       
        }
    }
    
    return positions;
};

RoomPosition.prototype.closestOf = function(positions) {
    return positions[0];
    var closest = null;
    var closestD = 9999999999

    for(var i=0; i<positions.length; i++) {
        var dx = this.x - positions[i].x;
        var dy = this.y - positions[i].y;

        var d = (dx*dx) + (dy*dx);

        if(d < closestD) {
            closest = positions[i];
            closestD = d;
        }
    }

    return closest;
};

Room.prototype.getRoute = function(routeName) {

    if(this.memory.routes[routeName]) return this.memory.routes[routeName];

    var route = [];

    var start = Game.flags[routeName+'-a'];
    var nextStep = Game.flags[routeName+'-b'];

    console.log('start, nextStep', start, nextStep);
    if(!start || !nextStep ) return [];

    var index = 'c';
    while(nextStep) {
        var routeSection = this.findPath(start.pos, nextStep.pos, {
            ignoreCreeps: true
        });

        route = route.concat(routeSection);
        console.log('route.length', route.length);
        start = nextStep;
        nextStep =  Game.flags[routeName+'-'+index];
        index++;
        console.log('index', index);
    }

    this.memory.routes[routeName] = route;
    return route;
}
