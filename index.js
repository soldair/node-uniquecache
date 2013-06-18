
var logtime = require('logtime-interval');

var id = 0;
var caches = {};

//
// i have many events that upon understanding produce a unique boolean.
// i want to fetch as little as possible so this library implments a few assumptions.
//   - unique hits are clustered mostly in time. around the length of interval.
//   - this works better when timestamps are mostly in order.
//   - if i have a pending request for the key im not unique.
//   - basic lru implemented for items. Items with a time difference of interval are culled each specified interval based on input timestamp.
//   - this lru's worse part is the full key scan each interval. 
//

module.exports = function(key,fetch,interval,max){
  var timers = logtime();

  if(typeof(key) === 'function') {
    max = interval;
    interval = fetch;
    fetch = key;
    key = false;
  }

  ++id;
  caches[id] = {};
  interval = interval || 1000*60*5;
  max = max || 10000;

  timers.setInterval(function(){
    var keys = Object.keys(caches[id]);
    for (var i =0;i<keys.length;++i){
      if(Math.abs(keys[i]-timers.currentTime) > interval) {
        delete caches[i][keys[i]];
      }
    }

    keys = Object.keys(caches[id]);
    if(keys.length > max) {
      remove = keys.length-max;
      keys = keys.slice(0,remove);
      for(i = 0;i<keys.length;++i){
        delete caches[id][keys[i]];
      }
    }
  },interval);

  // this returns a function curried with the cache that will call
  var fn = function uniqueCache(obj,time,cb){
    var k = _key(obj,key);
    timers.setTime(time);
    if(caches[id][k]) {
      if(caches[id][k] < time) caches[id][k] = time;
      return process.nextTick(function(){
        cb(false,false);
      });
    }
    
    caches[id][k] = time;
    process.nextTick(function(){
      fetch(obj,time,cb);
    });
  }

  fn.id = id;
  return fn;
}

module.exports.key = _key;

module.exports.caches = caches;

function _key(obj,key){
  var k = "";
  if(!key) return obj;
  for( var i=0;i<key.length;++i){
    k += ':'+obj[key[i]];
  } 
  return k;
}

