'use strict';

const test = require('../..');

test(async function () {
  this.not(false);
  this.not(0, 'test');
  this.not(true);
  this.not(1, 'test');
});
