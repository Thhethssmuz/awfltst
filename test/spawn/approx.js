'use strict';

const test = require('../..');

test(async function () {
  this.approx(99, 100, 5);
  this.approx(0.0000000000123, 0, 0.001, 'test');
  this.approx(106, 100, 5);
  this.approx(0.0123, 0, 0.001, 'test');
});
