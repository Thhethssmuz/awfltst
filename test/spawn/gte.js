'use strict';

const test = require('../..');

test(async function () {
  this.gte(1, 0);
  this.gte('alpha', 'alpha', 'test');
  this.gte(0, 1);
  this.gte('alpha', 'beta', 'test');
});
