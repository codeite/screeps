if(!Memory.cache.paths) Memory.cache.paths = {};

module.exports = {
    toCannonString: toCannonString,
    findPathOptionsToCannonString: findPathOptionsToCannonString
}

Room.prototype.findPathCached = function(startPos, endPos, options) {

    //if(!(startPos instanceof RoomPosition)) return ERR_INVALID_ARGS;
    //if(!(endPos instanceof RoomPosition)) return ERR_INVALID_ARGS;
/*
    var startPosCannon;
    if(startPos && startPos.toCanonString) {
        startPosCannon = startPos.toCanonString();
    } else 

    var endPosCannon;
    if(endPos && endPos.toCanonString) {
        endPosCannon = endPos.toCanonString();
    } else return ERR_INVALID_ARGS;
*/
    var path = this.findPath(startPos, endPos, options);

    return path;
}

function toCannonString() {
    var strings = [];

    for(var i in this.args) {
        var arg = this.args[i];

        if(typeof arg === 'function') strings.push(arg());
        else if (arg.toCanonString) strings.push(toCanonString());
        else return ERR_INVALID_ARGS;
    }

    return strings.join(',');
}

function findPathOptionsToCannonString(options) {
    var validOptions = [
        'ignoreCreeps',
        'ignoreDestructibleStructures',
        'maxOps',
        'heuristicWeight'
    ];

    for(var key in options) {
        if(validOptions.indexOf(key) === -1) return ERR_INVALID_ARGS;
    }

    var defaultOptions = {
        ignoreCreeps: false,
        ignoreDestructibleStructures: false,
        maxOps: 2000,
        heuristicWeight:1
    };
      
    options = _.assign(defaultOptions, options);

    var string;

    string = 'ic-'+b(options.ignoreCreeps)+
        ':ids-'+b(options.ignoreDestructibleStructures)+
        ':mo-'+options.maxOps+
        ':hw-'+options.heuristicWeight;



    return string;
}

function b(booleanValue) { return booleanValue?'t':'f';}

RoomPosition.prototype.toCanonString = function() {
    return this.roomName+":"+this.x+":"+this.y;
}