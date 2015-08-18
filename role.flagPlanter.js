Creep.prototype.flagPlanter = function(intel) {
    
    var flag = Game.flags[this.config.flag];
    
    if(!flag || !this.config.flag) {
        this.say('No flag!');
        return;
    }
    
    if(!this.config.roomName){
        this.say('No room!');
        return;
    }
    
    //console.log('this.room != this.config.roomName', this.room.name, this.config.roomName, this.room.name != this.config.roomName)
    if(this.room.name != this.config.roomName) {
        if(!this.memory.route || this.memory.route.length === 0 || this.memory.route[0].room != this.room.name) {
            //console.log('flag', this.room, this.config.roomName);
            this.memory.route = Game.map.findRoute(this.room, this.config.roomName);
        }
        
        if(this.memory.route.length) {
            var exit = this.pos.findClosest(this.memory.route[0].exit);
            this.moveTo(exit);
        }
    } else {
        if(!this.pos.isNearTo(flag.pos)) {
            this.moveTo(flag.pos);
        }
    }
  
    
};