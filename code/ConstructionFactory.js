var ConstructionFactory = function(room, currentLimits) {
    this.room = room;
    this.currentLimits = currentLimits;
    this.counts = {};
    this.roomMem = {};
}

ConstructionFactory.prototype.createPermanentConstruction = function (x, y, type) {
    if(~~(this.counts[type]) >= this.currentLimits[type]) {
        console.log('Can\'t build:', type, ' Current:', this.counts[type], 'limit:', this.currentLimits[type]);
        return;
    }

    this.roomMem['p'+x+'_'+y] = {x:x, y:y, t:type};
    this.counts[type] = (~~(this.counts[type]))+1;
};

ConstructionFactory.prototype.placeConstructionSites = function (type) {
    for(var posName in this.roomMem) {
        var pos = this.roomMem[posName];
        if(posName === 'p25_29'){
            console.log(posName, type, pos, pos.t === type);
        }
        
        if(!type || pos.t === type) {

            var res = this.room.createConstructionSite(pos.x, pos.y, pos.t);
            //if(res !== OK) {
            //    console.log('res:', res);
            //}
        }
    }
};

ConstructionFactory.prototype.save = function () {
    this.room.memory.permanentConstructions = this.roomMem;
};

module.exports = ConstructionFactory;
Game.ConstructionFactory = ConstructionFactory;