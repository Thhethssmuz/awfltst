'use strict';

const test = require('../..');

test(async function () {
  this.has({x: 'test'}, 'x');
  this.has({x: 'test'}, 'x', 'test');
  this.has(null, 'lol');
  this.has({}, 'fun', 'test');
});
