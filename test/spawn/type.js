'use strict';

const test = require('../..');

test(async function () {
  this.type(0, 'number');
  this.type('z', 'string', 'test');
  this.type(null, 'number');
  this.type(1, 'string', 'test');
  this.type(1, {});
});
