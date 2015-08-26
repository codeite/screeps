var limits = [];


function setLimit(defences, roads, spawns, extensions, storage, links) {
  var limit = {}

  limit[STRUCTURE_EXTENSION] = extensions;
  limit[STRUCTURE_RAMPART] = defences;
  limit[STRUCTURE_ROAD] = roads;
  limit[STRUCTURE_SPAWN] = spawns;
  limit[STRUCTURE_WALL] = defences;
  limit[STRUCTURE_LINK] = links;
  limit[STRUCTURE_STORAGE] = storage;
  limit.level = limits.length;
  limits.push(limit);
}

//       defences  roads     spawns extensions storage links  level
setLimit(0,        0,        0,     0,         0,      0);    0
setLimit(0,        0,        1,     0,         0,      0);    1
setLimit(Infinity, 0,        1,     5,         0,      0);    2
setLimit(Infinity, Infinity, 1,     10,        0,      0);    3
setLimit(Infinity, Infinity, 1,     20,        1,      0);    4
setLimit(Infinity, Infinity, 1,     30,        1,      2);    5
setLimit(Infinity, Infinity, 1,     40,        1,      3);    6
setLimit(Infinity, Infinity, 2,     50,        1,      4);    7
setLimit(Infinity, Infinity, 3,     Infinity,  1,      5);    8

module.exports = function(level) {
  return limits[~~level];
};