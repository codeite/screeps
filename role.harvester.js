module.exports = harvester;

Creep.prototype.harvester = harvester;

function harvester(intel) {

    if(this.carry.energy < this.carryCapacity) {
        var e = this.pos.lookFor('energy');
        if(e.length)  this.pickup(e[0]);
              

        var source;
        var pos = this.config.pos;
        if(pos) {
            if(pos.x !== this.pos.x || pos.y !== this.pos.y ) {
                this.moveTo(pos.x, pos.y);
                return;
            } else {
                if(pos.sourceId){
                    this.memory.sourceId = pos.sourceId;
                }
            }
        }

        if(this.memory.sourceId) {
            source = Game.getObjectById(this.memory.sourceId);
            if(!source) this.memory.sourceId = null;
        } else if(this.config.flag) {
            var flag = Game.flags[this.config.flag];

            
            if(false && flag){
                var found = flag.pos.lookFor('source');
                  if(found.length) {
                      source = found[0];
                      this.memory.sourceId = source.id;
                  }
            }
        } else {
            source = this.pos.findClosestByRange(FIND_SOURCES);
        }
        
        if(!this.pos.isNearTo(source)) {
            this.moveTo(source);
        } else {
            this.harvest(source);
        }
    } else {

        var target;

        if(this.room.storage && intel.reserves > 0.99) {
            target = this.room.storage;
        } else {
            target = this.room.rootSpawn;
        }
        
        if(!this.pos.isNearTo(target)) {
            this.moveTo(target);
        } else {
            this.transferEnergy(target);
        }
    }

}