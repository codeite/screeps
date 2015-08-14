var costs = {}
costs[MOVE] = 50;
costs[CARRY] = 50;
costs[WORK] = 100;


module.exports = {
    basicWorker: {parts: [MOVE, CARRY, WORK], cost: 200},
    heavyWorker: {parts: [MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK], cost: 550},
    heavyTransport: {parts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], cost: 550},

    costOf: costOf,
    costOfCassis: costOfCassis,
    largestWorker:largestWorker
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

