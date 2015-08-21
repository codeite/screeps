module.exports = function (creep) {
    if(Game.flags.Explorer)
        creep.moveTo(Game.flags.Explorer);    
}

Game.createExplorer = function () {
    return Game.spawns.Spawn1.createCreep([MOVE, MOVE, WORK], "Explorer", {role: "explorer"});
}

Game.killExplorer = function () {
    return Game.creeps.Explorer.suicide();
}

Game.claimController = function () {
    if(Game.creeps.Explorer.room.controller) {
        Game.creeps.Explorer.moveTo(Game.creeps.Explorer.room.controller);
        return Game.creeps.Explorer.claimController(Game.creeps.Explorer.room.controller);
    }

}