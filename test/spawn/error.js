'use strict';

const test = require('../..');

test(async function () {
  this.error(new Error('test'));
  this.error(new Error('test'), 'test');
});
