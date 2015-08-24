var ConstructionFactory = function(room) {
    this.room = room;

    if(!room.memory.permanentConstructions) room.memory.permanentConstructions = {};
    this.roomMem = room.memory.permanentConstructions;
}

ConstructionFactory.prototype.createPermanentConstruction = function (x, y, type) {
   this.roomMem[x+','+y] = {x:x, y:y, t:type};
};

ConstructionFactory.prototype.placeConstructionSites = function (type) {
    for(var posName in this.roomMem) {
        var pos = this.roomMem[posName];
        if(!type || pos.t === type) {
            room.createConstructionSite(pos.x, pos.y, pos.t);
        }
    }
};

Module.exports = ConstructionFactory;
Game.ConstructionFactory = ConstructionFactory;