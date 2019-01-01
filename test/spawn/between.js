'use strict';

const test = require('../..');

test(async function () {
  this.between(0, 0, 10);
  this.between(5, 0, 10, 'test');
  this.between(99, 0, 10);
  this.between(-1, 0, 10, 'test');
});
