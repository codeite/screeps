module.exports = function (creep) {
    
    var source;
    var config = creep.memory.config || {};
    if(config.sourceId) {
        source = Game.getObjectById(config.sourceId);
    } else {
	    source = creep.room.find(FIND_SOURCES)[0];
    }
    
    var dx = Math.abs(source.pos.x - creep.pos.x);
    var dy = Math.abs(source.pos.y - creep.pos.y);
   
    //console.log('dx, dy', dx, dy);
	if(dx > 1 || dy > 1) {
	    //creep.say("D d"+creep.ticksToLive);
		creep.moveTo(source);
	} else {
	    //creep.say("H d"+creep.ticksToLive);
		creep.harvest(source);
	}
}
