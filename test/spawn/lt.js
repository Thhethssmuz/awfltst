'use strict';

const test = require('../..');

test(async function () {
  this.lt(0, 1);
  this.lt('alpha', 'beta', 'test');
  this.lt(0, 0);
  this.lt('beta', 'alpha', 'test');
});
