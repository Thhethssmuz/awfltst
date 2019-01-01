'use strict';

const test = require('../..');

test(async function () {
  this.notContains([1, 2, 3], 0);
  this.notContains('abc', 'z', 'test');
  this.notContains([0, 1], 0);
  this.notContains('abc', 'b', 'test');
});
