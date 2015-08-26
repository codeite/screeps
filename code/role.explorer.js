module.exports = explorer;
Creep.prototype.explorer = explorer;

function explorer (intel) {
    
    if(!this.carry.energy) {
        this.moveTo(Game.spawns.Spawn2);
        Game.spawns.Spawn2.transferEnergy(this);
    } else if(Game.flags.Explorer) {
        this.moveTo(Game.flags.Explorer);
    }
}

Game.createExplorer = function () {
    return Game.spawns.Spawn2.createCreep([MOVE, MOVE, WORK, CARRY], "Explorer", {role: "explorer"});
}

Game.killExplorer = function () {
    return Game.creeps.Explorer.suicide();
}

Game.explorerDumpEnergy = function () {
    return Game.creeps.Explorer.dropEnergy();
}

Game.claimController = function () {
    if(Game.creeps.Explorer.room.controller) {
        Game.creeps.Explorer.moveTo(Game.creeps.Explorer.room.controller);
        return Game.creeps.Explorer.claimController(Game.creeps.Explorer.room.controller);
    }

}