Creep.prototype.transitPoint = function(intel) {
    
    if(this.config.pos) {
        if(!(this.pos.x == this.config.pos.x && this.pos.y ==this.config.pos.y)){
            //console.log(this, 'Moving into pos!', this.pos.x , this.config.pos.x , this.pos.y ,this.config.pos.y);
            this.moveTo(this.config.pos.x, this.config.pos.y);
            return;
        } else {
            if(this.carry.energy < this.carryCapacity) {
                var e = this.pos.lookFor('energy');
                if(e.length)  this.pickup(e[0]);
            }
        }
    }
};