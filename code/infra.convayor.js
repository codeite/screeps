var chassis = require('chassis');

module.exports = {
  buildConvayor: buildConvayor
};

function buildConvayor(spawn, source, dest, name) {
  //return;

  var route = spawn.room.findPathCached(source, dest, {
    ignoreCreeps: true,
    heuristicWeight: 0
  });

  var army = [];
  army.push({
      chassis: chassis.transporter(1), 
      name: 'conveyor-'+name+'-0', 
      role: 'conveyor', 
      config: {
        industry: 'pump', 
        pos: route[0],
        source: "FC:"+source.x+':'+source.y, 
        destination: "Pc:"+route[1].x+':'+route[1].y,
        maxAge: 10
      } 
    });

  for(var i=1; i<route.length-2; i++) {
    army.push({
      chassis: chassis.transporter(1), 
      name: 'conveyor-'+name+'-'+i, 
      role: 'conveyor', 
      config: {
        industry: 'pump', 
        pos: route[i], 
        source: "Pc:"+route[i-1].x+':'+route[i-1].y, 
        destination: "Pc:"+route[i+1].x+':'+route[i+1].y,
        maxAge: 10
      } 
    });
    
  }
  var i = route.length-2;
  var room = spawn.room;

  var found = room.lookAt( dest );

  var validDestination = _.find(found, function(f){
    if(f.type == 'creep') return f.creep;
    if(f.type == 'structure') return f.structure;
  });

  var destId;
  if(validDestination && validDestination.type == 'creep') destId = validDestination.creep.id;
  if(validDestination && validDestination.type == 'structure') destId = validDestination.structure.id;

  //console.log(i, 'destId:', destId);

  army.push({
      chassis: chassis.transporter(1), 
      name: 'conveyor-'+name+'-'+i, 
      role: 'conveyor', 
      config: {
        industry: 'pump', 
        pos: route[i], 
        source: "Pc:"+route[i-1].x+':'+route[i-1].y, 
        destination: "I:"+destId,
        maxAge: 10
      } 
    });
  return army;
  //console.log('buildConvayor', route);

};