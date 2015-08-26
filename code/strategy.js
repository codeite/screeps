var roomStrategies = {
  //"W9N9": require('strategy.room.W9N9'),
  "sim": require('strategy.room.sim')
};

var chassis = require('chassis');
var armyManager = require('armyManager');

var harvestIndustry = require('industry.harvest');

var stratergyMaintanance = require('strategy.maintanance');

module.exports = function(spawn, intel) {
    var army = [];
    //console.log(spawn, 'L:', intel.controllerLevel);

    var strategy = spawn.room.memory.strategy;
    var stats = spawn.room.memory.strategy;

    if(intel.controllerLevel === 0) {
        return;

    if(roomStrategies[spawn.room.name]) {
        var harvestArmy = harvestIndustry.apply(spawn, intel, roomStrategies[spawn.room.name]);

        army = army.concat(harvestArmy);
    } else {
        if(intel.controllerLevel === 1) {
            require('strategy.level1').applyStrategy(spawn, intel, army, strategy);
        } else if(intel.controllerLevel === 2) {
            require('strategy.level2').applyStrategy(spawn, intel, army, strategy);
        } else if(intel.controllerLevel === 3) {
            require('strategy.level3').applyStrategy(spawn, intel, army, strategy);
        } else if(intel.controllerLevel === 4) {
            require('strategy.level4').applyStrategy(spawn, intel, army, strategy);
        } else {
            require('strategy.level5').applyStrategy(spawn, intel, army, strategy);
        }
    }
    
    strategy.army = army;

    armyManager.maintainArmy(spawn, army, intel);
    
    stratergyMaintanance.tick(spawn, intel);
    
    strategy.preventBuildReason = '';
    if(spawn.storage && spawn.storage.store.energy > 10000) {
        strategy.preventBuild = false;
    } else {
        
        if(intel.reserves < 0.85){
            strategy.preventBuild = true;
            strategy.preventBuildReason = 'Reserves ('+((intel.reserves*100).toFixed(1))+'%) are less than 90%';
        } else if(stats.energyNeededForArmy > 0) {
            strategy.preventBuild = true;
            strategy.preventBuildReason = 'EnergyNeededForArmy ('+(Memory.stats.energyNeededForArmy)+'%) is greater than zero';
        } else {
            strategy.preventBuild = false;
        }
    }
    
    if(spawn.room.storage && spawn.room.storage.store.energy < 10000) {
        strategy.buildPumpCreeps = false;
    } else {
        strategy.buildPumpCreeps = true;
    }

    if(spawn.room.storage && spawn.room.storage.store.energy < 5000) {
        strategy.pump = false;
    } else {
        strategy.pump = true;
    }
}