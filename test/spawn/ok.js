'use strict';

const test = require('../..');

test(async function () {
  this.ok(true);
  this.ok(1, 'test');
  this.ok(false);
  this.ok('', 'test');
});
