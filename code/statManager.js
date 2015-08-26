module.exports = function (room) {
    var stats = room.memory.stats;
    var intel = room.memory.intel;
    
    if(!stats.pumpedHistory) stats.pumpedHistory = [];
    
    stats.pumpedHistory.push(stats.pumped);
    while(stats.pumpedHistory.length > 3600) {
        stats.pumpedHistory.shift();
    }
    
    var totalPumped = _.sum(stats.pumpedHistory);
    var average = (totalPumped/stats.pumpedHistory.length).toFixed(2);
    
    var ctrl = room.controller;
    var storage = room.storage;
    var left = ctrl.progressTotal - ctrl.progress;
    //console.log('ctrl', ctrl.progress, ctrl.progressTotal);
    
    var ticks = ~~(left/average);
    var time;
    
    if(ticks < 60) {
        time = ticks+' secconds';
    } else if(ticks < 3600) {
        time = (~~(ticks/60))+' minutes';
    } else {
        time = (~~(ticks/3600))+' hours';
    } 
    
    stats.energy = "Energy "+intel.totalEnergy+" of "+intel.maxEnergy +" ("+(~~(intel.reserves*100))+"%)";
    if(storage) stats.energy += " In storage: "+storage.store.energy+' of '+storage.storeCapacity+' ('+((storage.store.energy*100/storage.storeCapacity).toFixed(1))+'%)'
    
    var short = Math.min(stats.pumpedHistory.length, 300);
    var inShortData = stats.pumpedHistory.slice(stats.pumpedHistory.length-short, stats.pumpedHistory.length);
    var inShortSum = _.sum(inShortData);
    var inShortAverage = ((inShortSum/inShortData.length)*60).toFixed(0);
    
    stats.pumpedStatus = "Pumped in last "+(inShortData.length)+" seconds: "+inShortSum+" Av:"+inShortAverage+"/min  Pumped "+totalPumped+" in last "+(Math.floor(stats.pumpedHistory.length/60))+" minutes "+average+' ('+(average*60)+'/min). Left: '+left+' Time left '+time;
}





