module.exports = function () {
    var stats = Memory.stats;
    if(!stats.pumpedHistory) stats.pumpedHistory = [];
    
    stats.pumpedHistory.push(stats.pumped);
    while(stats.pumpedHistory.length > 10) {
        stats.pumpedHistory.shift();
    }
    
    var totalPumped = _.sum(stats.pumpedHistory);
    var average = totalPumped/stats.pumpedHistory.length;
    
    var ctrl = Game.spawns.Spawn1.room.controller;
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
    
    
    stats.pumpedStatus = "Pumed in last 10 tics "+average+'. Left: '+left+' Time left '+time;
}