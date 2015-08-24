var limits = [];


function setLimit(allowDefence, allowRoads, spawns, extensons, allowStorage, links) {
  limits.push({
    allowDefence: allowDefence, 
    allowRoads: allowRoads, 
    spawns: spawns, 
    extensons: extensons, 
    allowStorage: allowStorage, 
    links: links
  });
}

//       allowDefence allowRoads spawn, extensons storage links  level
setLimit(false,       false,     0,     0,        false,  0);    0
setLimit(false,       false,     1,     0,        false,  0);    1
setLimit(true,        false,     1,     5,        false,  0);    2
setLimit(true,        true,      1,     10,       false,  0);    3
setLimit(true,        true,      1,     20,       true,   0);    4
setLimit(true,        true,      1,     30,       true,   2);    5
setLimit(true,        true,      1,     40,       true,   3);    6
setLimit(true,        true,      2,     50,       true,   4);    7
setLimit(true,        true,      3,     9999,     true,   5);    8

module.exports = limits;