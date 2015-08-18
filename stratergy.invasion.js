var chassis = require('chassis');

module.exports = {
    
    applyInvasion: function(spawn, intel, army) {
        if(!Game.spawns.Spawn2){
        
            army.push({chassis: chassis.agileWorker, name: 'Builder3', role: 'builder', config: {industry: 'construction', buildSource: 'ExpeditionarySource', maxAge: 0, buildTarget: "BuildPriority"}});
            army.push({chassis: chassis.agileWorker, name: 'Builder4', role: 'builder', config: {industry: 'construction', buildSource: 'ExpeditionarySource', maxAge: 0, buildTarget: "BuildPriority"}});
            army.push({chassis: chassis.agileWorker, name: 'Builder5', role: 'builder', config: {industry: 'construction', buildSource: 'ExpeditionarySource', maxAge: 0, buildTarget: "BuildPriority"}});
        
        }

    }
}