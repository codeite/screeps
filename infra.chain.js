var chassis = require('chassis');

module.exports = {
  buildChain: buildChain
};

function buildChain(spawn, source, dest, name, creepCount) {

    if(!spawn || !source || !dest) {
        console.log('buildChain: ***** Missing spawn, source or dest:', spawn, source, dest);
        return [];
    }

     console.log('source dest:', source, dest);
    if(typeof source === 'string') source = spawn.getTarget(source);
    if(typeof dest === 'string') dest = spawn.getTarget(dest);
    
    if(!spawn || !source || !dest) {
        console.log('buildChain: ***** Missing spawn, source or dest:', spawn, source, dest);
        return [];
    }

    var route = spawn.room.findPathCached(source.pos, dest.pos, {
        ignoreCreeps: true,
        heuristicWeight: 0
    });

    var i=0;
    route.forEach(function(p){
        //spawn.room.createFlag(p.x, p.y, name+'-'+i);
        if(Game.flags[name+'-'+i])Game.flags[name+'-'+i].remove();
        i++;
    })

    var army = [];
   
    for(var i=1; i<=creepCount; i++) {
        army.push({
            chassis: chassis.transporter(1), 
            name: 'chain-'+name+'-'+i, 
            role: 'chain', 
            config: {
                industry: 'pump', 
                route: route, 
                sourceId: source.id, 
                destinationId: dest.id,
                maxAge: 10
            } 
        });
      }

    return army;
    //console.log('buildConvayor', route);

};