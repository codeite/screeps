Creep.prototype.conveyor = function(intel) {
    
    if(!this.config.pos){
        this.say('No Pos');
        return;
    }
    
    if(!(this.pos.x == this.config.pos.x && this.pos.y ==this.config.pos.y)){
        //console.log(this, 'Moving into pos!');
        this.say('M');
        var res = this.moveTo(this.config.pos.x, this.config.pos.y );
      
        if(res == ERR_NO_PATH) {
	        var targets = this.pos.findInRange(FIND_MY_CREEPS, 1);
            if(targets.length > 0) {
                for(var i in targets) {
                    if(targets[i].role == 'tanker') {
                        console.log('GET OUT OF MY WAY', targets[i], '!!');
                        targets[i].roleOverride('park', 5);
                    }
                }
            }
	    }
	    
    } else {
        for(var n=0; n<2; n++) {
            if(!this.memory.sourceId) {
                var sourceObject = this.getTarget(this.config.source);
                if(sourceObject) {
                    this.memory.sourceId = sourceObject.id;
                }
            }
            
            var source = Game.getObjectById(this.memory.sourceId);
            if(!source) {
                this.memory.sourceId = null;
                this.say('No Src');
                return;
            }
            
            if(!this.memory.destinationId) {
                var destinationObject = this.getTarget(this.config.destination);
                if(destinationObject) {
                    this.memory.destinationId = destinationObject.id;
                }
            }
            
            var destination = Game.getObjectById(this.memory.destinationId);
            if(!destination) {
                this.memory.destinationId = null;
                this.say('No Dst');
                return;
            }
            
            if(source instanceof Energy) {
                this.pickup(source);
            } else {
                source.transferEnergy(this);
            }
            var res = this.transferEnergy(destination);
        }
    }
  
    
};