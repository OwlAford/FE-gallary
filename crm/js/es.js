'use strict';

var a = {
  foo: 'hello'
};

var fn = function fn() {
  return console.log('foo');
};

var _c$d = { c: 1, d: 2 },
    c = _c$d.c,
    d = _c$d.d;


var b = Object.assign({}, a, {
  bar: 'world',
  fn: fn
});

console.log(b);
console.log(c);
console.log(d);