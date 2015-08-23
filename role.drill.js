Creep.prototype.drill = drill;

module.exports = function(creep) {
    creep.drill();
};

function drill() {
    
    if(this.config.pos) {
        if(!(this.pos.x == this.config.pos.x && this.pos.y ==this.config.pos.y)){
            //console.log(this, 'Moving into pos! At:', this.pos.x , this.pos.y , 'Going to:', this.config.pos.x ,this.config.pos.y, 'Drill at:', this.config.pos.sourceId);
            this.moveTo(this.config.pos.x, this.config.pos.y);
            return;
        }

        if(this.config.pos.sourceId) {
            this.memory.sourceId = this.config.pos.sourceId;
        }

    } 
    
    var source;
    var config = this.memory.config || {};
    if(this.memory.sourceId) {
        source = Game.getObjectById(this.memory.sourceId);
    }

    if(!source && config.sourceId) {
        source = Game.getObjectById(config.sourceId);
        this.memory.sourceId = source.id;
    }

    if(!source) {
        console.log(this, 'High CPU');
	    source = this.pos.findClosest(FIND_SOURCES);
        this.memory.sourceId = source.id;
    }
    
    var dx = Math.abs(source.pos.x - this.pos.x);
    var dy = Math.abs(source.pos.y - this.pos.y);
   
    //console.log('dx, dy', dx, dy);
	if(dx > 1 || dy > 1) {
	    //creep.say("D d"+creep.ticksToLive);
		this.moveTo(source);
	} else {
	    //creep.say("H d"+creep.ticksToLive);
		this.harvest(source);
		//console.log('creep.room.memory', creep.room.memory.storage);
		//return;
		if(this.room.storage && this.carry.energy) {
	        if(this.pos.isNearTo(this.room.storage)) {
	            var res = this.transferEnergy(this.room.storage);
	            //console.log('Energy transfered: ', res);
	        }
		}
	}
}