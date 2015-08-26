var chassis = require('chassis');
var armyManager = require('armyManager');

module.exports = {
    
    applyInvasion: function(spawn, intel) {
        var army = [];
        
        if(!Game.spawns.Spawn2){
        
            army.push({chassis: chassis.agileWorker, name: 'Builder3', role: 'builder', config: {industry: 'construction', buildSource: 'ExpeditionarySource', maxAge: 0, buildTarget: "BuildPriority"}});
            army.push({chassis: chassis.agileWorker, name: 'Builder4', role: 'builder', config: {industry: 'construction', buildSource: 'ExpeditionarySource', maxAge: 0, buildTarget: "BuildPriority"}});
            army.push({chassis: chassis.agileWorker, name: 'Builder5', role: 'builder', config: {industry: 'construction', buildSource: 'ExpeditionarySource', maxAge: 0, buildTarget: "BuildPriority"}});
        
        }
        
        army.push({chassis: chassis.rov, name: 'rov', role: 'flagPlanter', config: {industry: 'exploration', flag: "Mine", roomName:"W8N8"}});
        
        armyManager.maintainArmy(spawn, army, intel);
    }
}