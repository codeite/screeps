if(false) {
    if(Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES).length){
        Game.spawns.Spawn1.createCreep([WORK, CARRY, WORK, CARRY, MOVE], "Builder1", {role: "builder"})
        //Game.spawns.Spawn1.createCreep([WORK, CARRY, WORK, CARRY, MOVE], "Builder2", {role: "builder"})
    }
    
    for(var i=1; i<=5; i++){
       Game.spawns.Spawn1.createCreep([MOVE, CARRY, WORK, WORK, WORK], "Pumper"+i, {role: "pumper"});
       Game.spawns.Spawn1.createCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], "Pumper"+i+"Feeder", {role: "tanker4", source: "S:Spawn1", destination: "C:Pumper"+i})
    }
    
    
    Game.spawns.Spawn1.createCreep([MOVE, WORK, WORK, WORK, WORK], "Drill1a", {role: "drill"});
    Game.spawns.Spawn1.createCreep([MOVE, WORK, WORK, WORK, WORK], "Drill1b", {role: "drill"});
    //Game.spawns.Spawn1.createCreep([MOVE, WORK, WORK], "Drill2", {role: "drill2", flagName: "DrillSite1"});
    
    for(var i=1; i<3; i++) {
        Game.spawns.Spawn1.createCreep([MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], "Tanker"+i, {role: "tanker2"});
    }
    
    Game.spawns.Spawn1.createCreep([MOVE, MOVE, CARRY, CARRY ], "Load1", {role: "tanker3", source: 'id616310', destination:'id148070;id78810;id527690;id305410;id442350'});
    //Game.spawns.Spawn1.createCreep([MOVE, MOVE, CARRY, CARRY ], "Load2", {role: "tanker3", source: 'id616310', destination:'id148070;id78810;id527690;id305410'});
    
    Game.spawns.Spawn1.createCreep([MOVE, CARRY ], "FL1", {role: "forklift", source: 'DrillSite1', destination:'a'});
    Game.spawns.Spawn1.createCreep([MOVE, CARRY ], "FL2", {role: "forklift", source: 'a', destination:'e'});
    
    
    //Game.spawns.Spawn1.createCreep([MOVE, MOVE, CARRY, CARRY ], "ControlTanker1", {role: "tanker1"});
}
