var chassis = require('chassis');

module.exports = {
    applyStrategy: applyLevelOne
};

function applyLevelOne(spawn, intel, army) {
    
    // Get to 6 Basic workers. 3 Harvest, 3 Pump
    var i=1;
    for(; i<=3; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+i, role: 'harvester', config: {industry: 'energy', pos: intel.energySites[i-1]}});
    for(; i<=6; i++) army.push({chassis: chassis.basicWorker, name: 'BasicWorker'+i, role: 'pumper.mobile', config: {industry: 'pump'}});
}