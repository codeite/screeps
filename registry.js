if(typeof Memory.registry !== 'object') Memory.registry = {};

function generateName(title) {
    return title +'-'+ (~~(Math.random() * 0xFFFF)).toString(16);
}

function register(title, name) {
    Memory.registry[title] = name;
}

function eject(title) {
    delete Memory.registry[title];
}

function getCreepName(title) {
    return Memory.registry[title];
}

function getCreep(title) {
    var name = getCreepName(title);
    if(name) return Game.creeps[name];
    return null;
}

Game.registry = {
    generateName: generateName,
    register: register,
    eject: eject,
    getCreepName: getCreepName,
    getCreep: getCreep
}

if(Memory.stratergy.registryAutoEject > 0) {
    for(var title in Memory.registry) {
        var creep = getCreep(title);
        //console.log(title, 'ticksToLive:', (creep&&creep.ticksToLive));
        if(creep && creep.ticksToLive < 100) {
            eject(title);
        }
    }
}