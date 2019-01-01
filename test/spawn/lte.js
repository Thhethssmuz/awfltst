'use strict';

const test = require('../..');

test(async function () {
  this.lte(0, 0);
  this.lte('alpha', 'beta', 'test');
  this.lte(1, 0);
  this.lte('beta', 'alpha', 'test');
});
