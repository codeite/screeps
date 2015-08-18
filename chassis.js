var costs = {}
costs[MOVE] = 50;
costs[CARRY] = 50;
costs[WORK] = 100;

var version = 2;
if(Memory.memorization.version != version ) Memory.memorization = {version: version};

module.exports = {
    rov: {parts: [MOVE], cost: 50},
    ram: {parts: [MOVE, MOVE, ATTACK, ATTACK], cost: 260},
    basicWorker: {parts: [MOVE, CARRY, WORK], cost: 200},
    agileWorker: {parts: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK], cost: 500},
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
    var id = workerParts + ':' + haveCarry;
    if(Memory.memorization.staticWorker && Memory.memorization.staticWorker[id]) {
        return Memory.memorization.staticWorker[id];
    }
    
    var parts = [MOVE];
    
    for(var i=0; i<workerParts/7; i++){
        parts.push(MOVE);
    }
    
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
    Memory.memorization.staticWorker[id] = result;
    return result;
}

function largestWorker(energy) {
    if(Memory.memorization.largestWorker && Memory.memorization.largestWorker[energy]) {
        return Memory.memorization.largestWorker[energy];
    }
    
    var parts = [MOVE, CARRY];
    
    var cost = costOfCassis(parts);
    var moveParts = 1;
    
    for(var max = 30, i=0; cost<energy && max > 0; max--, i++){
        
       
        var weightToMove = (parts.length-moveParts)/moveParts;
         //console.log('x', parts, weightToMove);
        var part;
        if(weightToMove > 5){
            part = MOVE;
            moveParts++;
        } else {
            part = WORK;
        }
        
        parts.push(part);
        cost += costs[part];
      
        //console.log('cost', cost, 'parts:', parts);
    }
    while(cost > energy) {
        parts.pop();
        cost = costOfCassis(parts);
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

