Creep.prototype.chain = function(intel) {

    if(!this.config.route) {
        console.log(this, '***** Missing route');
        return;
    }
    var route = this.config.route.slice(0, -1);
    var source = Game.getObjectById(this.config.sourceId);
    var destination = Game.getObjectById(this.config.destinationId);
    
    if(!source || !destination) {
        console.log(this, '***** Missing source or destination:', source, destination);
        return;
    }

    var routeIndex = _.findIndex(route, {x: this.pos.x, y: this.pos.y});

    //console.log(this, 'curentPos', this.pos.x, this.pos.y, 'routeIndex', routeIndex);

    if(routeIndex === -1) {
        //console.log('route', route);
        if(!this.at(route[0])) {
            this.say('M to 0');
            this.moveTo(route[0].x, route[0].y);
            return;
        } else {
            routeIndex = 0;
        }
    }

    if(routeIndex !== -1) {
        var routePos = route[routeIndex];

        //console.log(this, 'Should be at:', routePos.x, routePos.y, 'Actually:', this.pos.x, this.pos.y);
       
        if(!this.at(routePos)) {
            console.log(this, 'Not where expected! Starting again.');
            return;
        }


        if(routeIndex === 0 && this.carry.energy < this.carryCapacity) {

            var res = this.loadEnergyFrom(source);
            if(res !== OK) console.log(this, 'Error loading energy:', res);
            
        } else if(routeIndex === route.length-1 && this.carry.energy > 0) {

            this.unloadEnergyTo(destination);
        }

        var direction = this.carry.energy < this.carryCapacity ? -1 : 1;

        var nextIndex = routeIndex + direction;
        if(nextIndex < 0 || nextIndex > route.length-1) nextIndex = routeIndex;
            
        var nextPos = route[nextIndex];
        
       
        //console.log(this, 'direction:', direction, 'nextIndex:', nextIndex, 'nextPos:', JSON.stringify(nextPos));
        var creepInFront = nextPos ? this.room.lookForAt('creep', nextPos.x, nextPos.y) : [];

        if(creepInFront.length) {
            if(creepInFront[0].memory.role === 'chain') {
                if(direction === 1) {
                    this.unloadEnergyTo(creepInFront[0]);
                    return;
                } else {
                    this.loadEnergyFrom(creepInFront[0]);
                    return;
                }
            }
        } else {
            //console.log(this, 'this.fatigue', this.fatigue);
            if(this.fatigue === 0) {
                //console.log(this, 'routePos:', JSON.stringify(routePos));
                var dir;
                if(direction === 1) {
                    dir = nextPos.direction;
                } else if(direction === -1) {
                    dir = 1+((routePos.direction+3)%8);
                }

                //console.log(this, 'About to move dir:', dir, 'Was at:', this.pos.x, this.pos.y);
                var res = this.move(dir);
                routePos = nextPos;

                //console.log(this, 'res:', res, 'Now at:', this.pos.x, this.pos.y);
        
            }
        }
        
    }
};
