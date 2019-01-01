'use strict';

const test = require('../..');

test(async function () {
  this.type([], Array);
  this.type(() => {}, Function, 'test');
  this.type(null, Array);
  this.type(1, Object, 'test');
  this.type(1, () => {});
});
