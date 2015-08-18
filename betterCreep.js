
Object.defineProperty(Creep.prototype, 'config', {
  get: function() { return this.memory.config || {}; },
  set: function(val) {  this.memory.config = val; },
  enumerable: true,
  configurable: true
});

Object.defineProperty(Creep.prototype, 'role', {
  get: function() { return this.memory.role || ''; },
  set: function(val) {  this.memory.role = val; },
  enumerable: true,
  configurable: true
});

Creep.prototype.roleOverride = function(role, ttl) {
    this.memory.roleOverride = {role: role, ttl: ttl};
}