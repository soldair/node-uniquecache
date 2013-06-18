[![Build Status](https://secure.travis-ci.org/soldair/node-uniquecache.png)](http://travis-ci.org/soldair/node-uniquecache)

uniquecache
===========

cognitive overhead.. if you need to implement this kind of logic you have at least on async call. i wanted it to look exactly the same. 

```js
fetch(myUniqueObject,Date.now(),function(err,unique){
  if(unique) console.log('yayayayaya!')
})

```

> but its kinda weird that i have to pass time you know bro?

you may not know what time you are processing i certainly cannot assume that you are processing things related to now!



so to use it.. you know. you require the library

```js
var uniquecache = require('uniquecache');
```

The function returns the fetch function curried with cache magic. This will only call your real fetch function when it really has to. You know.. the useful part.

```js
var fetch = uniquecache(
  ['id'] // use these object key's values to build the unique key from each object passed to fetch
  ,function(obj,time,callback){
    callback(false,true);
    calls++;
  }
  ,1 // check every milisecond for data older than a milisecond [defaults to 5 minutes]
  ,1 // only ever hold one item. like ever. [defaults to 10000]
); 
```

> Really curry!? thats kind an effed api bro. its spicy and stuff why can't this be a stream.

Well if you look at it in http://maxogden.github.io/flavors there are clearly things that go with curry and though node is not on the list i think we'll recover.

> but im a library implementor i hate cognitive overhead what does it look like for me?


```js
var fetch = uniquecache(['id'],function(obj,time,cb){
  api.call(url+'/'+obj.id,function(err,data){
    cb(err,data?false:true);
  });
});

module.exports = function(obj,cb){
  fetch(obj,Date.now(),cb);
}

```

> oh thats not bad. thanks.



this will be useful to you only if
----------------------------------

- unique hits are clustered mostly in time. around the length of interval.
- this works better when timestamps are mostly in order.
- if i have a pending request for the key im not unique.
- basic lru implemented for items. Items with a time difference of interval are culled each specified interval based on input timestamp.
- this lru's worse part is the full key scan each interval. have millions of keys in cache? if not it probably wont break your app unless your interval is too tight. 




