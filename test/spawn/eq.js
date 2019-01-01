'use strict';

const test = require('../..');

test(async function () {
  this.eq(1, 1);
  this.eq('abc', 'abc', 'test');
  this.eq({a: 1}, {b: 2});
  this.eq([1, '2', 'three'], [1, 2, 3], 'test');
});


const expected = {
  null   : null,
  undefined,
  boolean: false,
  number : [NaN, 0, -0, Infinity],
  string : '',
  regexp : /test/i,
  symbol : Symbol('test'),
  object : {
    null  : Object.create(null),
    nested: {a: {b: {c: 'c'}}}
  }
};

const actual = Object.assign({}, expected, {
  boolean: true,
  object : {
    null  : Object.create(null),
    nested: {a: {b: {c: 'not c'}}}
  }
});

test('diffable', async function () {
  this.eq(actual, expected);
});

test('undiffable', {inspect: {depth: 10, sorted: false}}, async function () {
  this.eq(actual, expected);
});
