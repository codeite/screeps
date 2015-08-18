Creep.prototype.drill = drill;

module.exports = function(creep) {
    creep.drill();
};

function drill() {
    
    if(this.config.pos) {
        if(!(this.pos.x == this.config.pos.x && this.pos.y ==this.config.pos.y)){
            console.log(this, 'Moving into pos!');
            this.moveTo(this.config.pos);
            return;
        } 
    }
    
    var source;
    var config = this.memory.config || {};
    if(config.sourceId) {
        source = Game.getObjectById(config.sourceId);
    } else {
	    source = this.room.find(FIND_SOURCES)[0];
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