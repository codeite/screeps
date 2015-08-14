if(typeof Memory.registry !== 'object') Memory.registry = {};
if(typeof Memory.registerOnDeath !== 'object') Memory.registerOnDeath = {};


function generateName(title) {
    return title +'-'+ (~~(Math.random() * 0xFFFF)).toString(16);
}

function registerOnDeath(title, name) {
    console.log('registerOnDeath title:', title, 'name:', name);
    console.log(title, ':', name, 'will take over from', getCreepName(title), 'on death');
    Memory.registerOnDeath[title] = name;
}

function register(title, name) {
     console.log('register', title, name);
    Memory.registry[title] = name;
}

function eject(title) {
    console.log('Eject', title);
    delete Memory.registry[title];
}

function getCreepName(title) {
    return Memory.registry[title];
}

function getCreep(title) {
    var name = getCreepName(title);
    if(name) {
        var creep = Game.creeps[name];
        return creep;
    }
    return null;
}

Game.registry = {
    generateName: generateName,
    registerOnDeath: registerOnDeath,
    register: register,
    eject: eject,
    getCreepName: getCreepName,
    getCreep: getCreep
}

for(var title in Memory.registerOnDeath) {
    console.log('title=', title, 'getCreep(title)=', getCreep(title));
    var creep = getCreep(title);
    if(!creep) {
        console.log('Creep '+title+' took over');
        Memory.registry[title] = Memory.registerOnDeath[title];
        delete Memory.registerOnDeath[title];
    }
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