module.exports = {
    
    tick : function (spawn) {
        
        if(Game.time % 3 === 0) {
            var roads = Memory.stratergy.roads4;
            if(Memory.stratergy.roads4) roads = roads.concat(Memory.stratergy.roads5);
            
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
                       Memory.repairJobs[xy[0]+':'+xy[1]] = {x:xy[0], y:xy[1], t:'road', hits: road.hits};
                   }
               } else {
                   spawn.room.createConstructionSite(xy[0], xy[1], STRUCTURE_ROAD);
               }
            });
            
            Memory.stats.roads = 'There are '+roadCount+' out of '+expectedRoads+'. Their average condition is '+(~~(100*totalHits/roadCount))+'%. Open repair jobs: '+( Object.keys(Memory.repairJobs).length);
        }
    }
};