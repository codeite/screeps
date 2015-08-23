if(!Memory.cache.paths) Memory.cache.paths = {};

module.exports = {
    toCannonString: toCannonString,
    findPathOptionsToCannonString: findPathOptionsToCannonString
}

Room.prototype.findPathCached = function(startPos, endPos, options) {

    if(!(startPos instanceof RoomPosition)) return ERR_INVALID_ARGS;
    if(!(endPos instanceof RoomPosition)) return ERR_INVALID_ARGS;

    var key = toCannonString(startPos, endPos, findPathOptionsToCannonString(options));
    //console.log('key:', key);
    if(Memory.cache.paths[key]) {
        return Memory.cache.paths[key];
    }

    var path = this.findPath(startPos, endPos, options);

    Memory.cache.paths[key] = path;

    return path;
}

function toCannonString() {
    var strings = [];

    for(var i in arguments) {
        var arg = arguments[i];

        if(typeof arg === 'string') strings.push(arg);
        else if (arg.toCanonString) strings.push(arg.toCanonString());
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