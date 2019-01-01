'use strict';

const test = require('../..');

test(async function () {
  this.notBetween(99, 0, 10);
  this.notBetween(-1, 0, 10, 'test');
  this.notBetween(0, 0, 10);
  this.notBetween(5, 0, 10, 'test');
});
