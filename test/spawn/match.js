'use strict';

const test = require('../..');

test(async function () {
  this.match('Testing is fun', /test/i);
  this.match('Testing is fun', /^Test/, 'test');
  this.match(null, /null/i);
  this.match('fun', /test/i, 'test');
});
