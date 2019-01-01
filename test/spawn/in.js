'use strict';

const test = require('../..');

test(async function () {
  this.in(1, [1, 2, 3]);
  this.in('b', 'abc', 'test');
  this.in(0, [1, 2, 3]);
  this.in(null, 'abc', 'test');
});
