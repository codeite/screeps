
Object.defineProperty(Creep.prototype, 'config', {
    get: function() { return this.memory.config || {}; },
    set: function(val) {  this.memory.config = val; },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'role', {
    get: function() { return this.memory.role || ''; },
    set: function(val) {  this.memory.role = val; },
    enumerable: true,
    configurable: true
});

Creep.prototype.roleOverride = function (role, ttl) {
    this.memory.roleOverride = {role: role, ttl: ttl};
};

Creep.prototype.at = function (posOrX, y) {
    //console.log('at:', posOrX, y, 'actually:', this.x, this.y);
    if(posOrX.x && posOrX.y) return this.at(posOrX.x, posOrX.y);
    return this.pos.x === posOrX && this.pos.y === y;
}

Creep.prototype.unloadEnergyTo = function(destination) {
    if(destination instanceof Spawn || destination instanceof Creep) {
        return this.transferEnergy(destination);
    }

    if(destination instanceof Structure) {
        switch(destination.structureType) {
            case STRUCTURE_EXTENSION:
            case STRUCTURE_STORAGE:
            case STRUCTURE_LINK:
                return this.transferEnergy(destination);

            case STRUCTURE_RAMPART:
            case STRUCTURE_ROAD:
            case STRUCTURE_WALL:
                return this.repair(destination);

            case STRUCTURE_CONTROLLER:
                return this.upgradeController(destination);  
        }
    }

    console.log('***** Trying to unload into:', destination);
    return -7;
}

Creep.prototype.loadEnergyFrom = function(source) {
    if(source instanceof Spawn || source instanceof Creep) {
        return source.transferEnergy(this);
    }

    if(source instanceof Energy) {
        return this.pickup(source);
    }

    if(source instanceof Structure) {
        switch(source.structureType) {
            case STRUCTURE_EXTENSION:
            case STRUCTURE_STORAGE:
            case STRUCTURE_LINK:
                return source.transferEnergy(this); 
        }
    }

    console.log('***** Trying to load from:', source);
    return -7;
}