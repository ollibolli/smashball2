"use strict";

var fs = require("fs");

let getStuff = function *() {
  let totalStuff = [];
  let data;

  // pause. On `iterator.next()` get the 1st tweet and carry on.
  data = yield get('./1.txt');
  totalStuff.push(data);

  // pause. On `iterator.next()` get the 2nd tweet and carry on.
  data = yield get2('!--- 2 ---!');
  totalStuff.push(data);

  data = yield "!---String---!";
  totalStuff.push(data);

  // pause. On `iterator.next()` get the 3rd tweet and carry on.
  data = yield get('./3.txt');
  totalStuff.push(data);

  // log the tweets
  console.log(totalStuff);
  return totalStuff;
};

// Thunk
let get = function (url) {
  // return a function, passing in our callback
  return function (callback) {
    fs.readFile(url, 'utf8', function(err, response){
      if (err) throw err;
      setTimeout(function(){
        callback(response);
      }, 1000);
    });
  };
};

let get2 = function(data){
  return function(callback){
    setTimeout(function(){
      callback(data);
    },1000);
  }
};

run(getStuff);

function run(generator){
  var it = generator();
  rec();

  function rec(res){
    let result = it.next(res);
    if (!result.done){
      switch(typeof result.value) {
        case 'function':
          result.value(rec);
          break;
        case 'object':
          if ('function' === typeof result.value.then) {
            result.value.then(rec);
          } else {
            rec(result.value);
          }
          break;
        default :
          rec(result.value);
          break;
      }
    }
  }
}