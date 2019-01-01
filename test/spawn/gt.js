'use strict';

const test = require('../..');

test(async function () {
  this.gt(1, 0);
  this.gt('beta', 'alpha', 'test');
  this.gt(0, 1);
  this.gt('alpha', 'alpha', 'test');
});
