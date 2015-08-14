var costs = {}
costs[MOVE] = 50;
costs[CARRY] = 50;
costs[WORK] = 100;


module.exports = {
    basicWorker: {parts: [MOVE, CARRY, WORK], cost: 200},
    heavyWorker: {parts: [MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK], cost: 550},
    lightTransport: {parts: [MOVE, MOVE, CARRY, CARRY], cost: 300},
    heavyTransport: {parts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], cost: 550},

    costOf: costOf,
    costOfCassis: costOfCassis,
    largestWorker:largestWorker,
    staticWorker: staticWorker,
    transporter:transporter
}

function transporter(carryParts) {
    if(Memory.memorization.tanker && Memory.memorization.tanker[carryParts]) {
        return Memory.memorization.tanker[carryParts];
    }
    
    var parts = [];
    for(var i=0; i<carryParts; i++){
        parts.push(MOVE);
        parts.push(CARRY);
    }
    
     var cost = costOfCassis(parts);
    var result = {parts: parts, cost: cost};
    
    if(!Memory.memorization.tanker) Memory.memorization.tanker = {};
    Memory.memorization.tanker[carryParts] = result;
    return result;
}

function staticWorker(workerParts, haveCarry) {
    if(Memory.memorization.staticWorker && Memory.memorization.staticWorker[workerParts]) {
        return Memory.memorization.staticWorker[workerParts];
    }
    
    var parts = [MOVE];
    
    if(haveCarry) {
        parts.push(CARRY);
    }
    
    for(var i=0; i<workerParts; i++){
        parts.push(WORK);
    }
    
    var cost = costOfCassis(parts);
    var result = {parts: parts, cost: cost};
    //console.log('working on largestWorker in',energy, 'out:',result.cost);
    
    if(!Memory.memorization.staticWorker) Memory.memorization.staticWorker = {};
    Memory.memorization.staticWorker[workerParts] = result;
    return result;
}

function largestWorker(energy) {
    if(Memory.memorization.largestWorker && Memory.memorization.largestWorker[energy]) {
        return Memory.memorization.largestWorker[energy];
    }
    
    var parts = [MOVE, CARRY];
    
    var cost = costOfCassis(parts);
    var max = 30;
    for(;cost+100<=energy && max > 0; cost += 100, max--){
        parts.push(WORK);
      
        //console.log('cost', cost, 'parts:', parts);
    }
    
    var result = {parts: parts, cost: cost};
    //console.log('working on largestWorker in',energy, 'out:',result.cost);
    
    if(!Memory.memorization.largestWorker) Memory.memorization.largestWorker = {};
    Memory.memorization.largestWorker[energy] = result;
    return result;
}

function costOfCassis(parts) {
        var cost = 0;
        
        _.each(parts, function (p) {
            var c = costOf(p);
            //console.log('costOfCassis - p', p, c);
            cost += c
            
        });
        
        return cost;
    }

function costOf(p){
    //console.log('costOf', p, '=', costs[p]);
    if(costs[p]) return costs[p];
    
    //console.log('What is', p);
    return 1000;
}

