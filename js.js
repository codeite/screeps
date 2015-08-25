String.prototype.betterSplit = function(deliminator, count) {
    if(count === 1) return [this.toString()];

    if(!count) count = Infinity;
    var target = this;
    
    var bits = [];
    
    do {
        if(count === 1) {
          bits.push(target);
        } else {
          var pos = target.indexOf(deliminator);
          //console.log('pos:', pos);
          if(pos === -1){
            bits.push(target);
          } else {
            bits.push(target.substr(0, pos));
            target = target.substr(pos+1);
          }
        }

        count--;
    } while(count >= 1 && pos !== -1);
    
    return bits;
}
/*
function ccs(a,b,c) {
  console.log('Boo', a, b, c);
  wibble;
  this.createConstructionSiteOld(a,b,c);
}

Room.prototype.createConstructionSiteOld = Room.prototype.createConstructionSite;
Room.prototype.createConstructionSite = ccs;
*/