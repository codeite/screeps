module.exports = {
    
    tick : function (spawn, intel) {
        
        if(Game.time % 3 === 0) {

            if(Game.time % 300 === 0 ) {
              for(var i=2; i<=intel.controllerLevel; i++)
                require('strategy.level'+i).applyInfrastructure(spawn);
            }

            var roads = [];
            if(spawn.room.memory.roads3) roads = roads.concat(spawn.room.memory.roads3);
            if(spawn.room.memory.roads4) roads = roads.concat(spawn.room.memory.roads4);
            if(spawn.room.memory.roads5) roads = roads.concat(spawn.room.memory.roads5);
            if(spawn.room.memory.roads6) roads = roads.concat(spawn.room.memory.roads6);
            //console.log(spawn, roads);

            var totalHits = 0;
            var roadCount = 0
            var expectedRoads = roads.length;
            
            roads.forEach(function(xy){
               var look = spawn.room.lookForAt('structure', xy[0], xy[1]);
               var road = null;
               if(look.length && look[0].structureType == 'road') {
                   road = look[0];
               } else {
                  if(look.length)expectedRoads--
               }
              
               if(road){
                   roadCount++;
                   totalHits += (road.hits / road.hitsMax);
                   
                   if(road.hits < ((road.hitsMax/3)*2) ) {
                       spawn.room.memory.repairJobs[xy[0]+':'+xy[1]] = {x:xy[0], y:xy[1], t:'road', hits: road.hits};
                   }
               } else {
                   spawn.room.createConstructionSite(xy[0], xy[1], STRUCTURE_ROAD);
               }
            });
            var averageCondition = totalHits/roadCount;
            spawn.room.memory.stats.averageCondition = averageCondition
            spawn.room.memory.stats.roads = 
              'There are '+roadCount+' out of '+expectedRoads+'. '+
              'Their average condition is '+(~~(100*averageCondition))+'%. '+
              'Open repair jobs: '+( Object.keys(spawn.room.memory.repairJobs).length);
        }
    }
};