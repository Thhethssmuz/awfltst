'use strict';

const test = require('../..');

test(async function () {
  this.ne(1, 2);
  this.ne('abc', 'xyz', 'test');
  this.ne({a: 1}, {a: 1});
  this.ne([1, 2, 3], [1, 2, 3], 'test');
});
