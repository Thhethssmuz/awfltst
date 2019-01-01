'use strict';

const test = require('../..');

test(async function () {
  this.contains([1, 2, 3], 1);
  this.contains('abc', 'a', 'test');
  this.contains([0], 1);
  this.contains(null, 1, 'test');
});
