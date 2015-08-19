
var chassis = require('chassis');
var armyManager = require('armyManager');

var applyInvasion = require('stratergy.invasion');
var stratergyMaintanance = require('stratergy.maintanance');

module.exports = function(spawn, intel) {
    var army = [];
    
    if(intel.controllerLevel === 1) {
        require('strategy.level1').applyStrategy(spawn, intel, army);
    } else if(intel.controllerLevel === 2 || intel.controllerLevel === 3) {
        require('strategy.level2').applyStrategy(spawn, intel, army);
    } else if(intel.controllerLevel === 4) {
        require('strategy.level4').applyStrategy(spawn, intel, army);
    } else {
        require('strategy.level5').applyStrategy(spawn, intel, army);
    }
    
    applyInvasion.applyInvasion(spawn, intel, army);
    
    armyManager.maintainArmy(spawn, army, intel);
    
    stratergyMaintanance.tick(spawn);
    
    //console.log('spawn.storage.store.energy', spawn.storage.store.energy);
    if((intel.reserves > 0.9 && Memory.stats.energyNeededForArmy <= 0) || (spawn.storage && spawn.storage.store.energy > 10000) ) {
        Memory.stratergy.preventBuild = false;
    } else {
        Memory.stratergy.preventBuild = true;
    }
    
    if(spawn.storage && spawn.storage.store.energy < 10000) {
        Memory.stratergy.pump = false;
    } else {
        Memory.stratergy.pump = true;
    }
    
}