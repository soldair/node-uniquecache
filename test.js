var test = require('tap').test
var uniquecache = require('../lib/uniquecache')

test("can cache a unique",function(t){

  var calls = 0;
  var checked = 0;
  var time = Date.now();


  var fetch = uniquecache(['id'],function(obj,time,callback){
    callback(false,true);
    calls++;
  },1,1);

  var obj = _obj(1);

  fetch(obj,time,function(err,unique){

    t.equals(unique,true,'should be unique');

    fetch(obj,time+1,function(err,unique){

      t.equals(false,unique,'should not be unqiue');
      t.equals(calls,1,'should have called once because of some cache or something.');
      t.equals(1,checked,'should have checked unique');

      t.end();

    });
    
  });


  fetch(obj,time,function(err,unique){
      t.equals(false,unique,'should not be unique if concurrent');
      checked++;
  })

});


function _obj(id){
  return {
    id:id
  };
}
