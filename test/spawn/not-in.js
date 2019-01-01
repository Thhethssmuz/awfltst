'use strict';

const test = require('../..');

test(async function () {
  this.notIn(0, [1, 2, 3]);
  this.notIn('z', 'abc', 'test');
  this.notIn(1, [1, 2, 3]);
  this.notIn('bc', 'abc', 'test');
});
