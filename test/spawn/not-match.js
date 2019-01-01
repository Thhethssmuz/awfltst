'use strict';

const test = require('../..');

test(async function () {
  this.notMatch(null, /null/i);
  this.notMatch('fun', /test/i, 'test');
  this.notMatch('Testing is fun', /test/i);
  this.notMatch('Testing is fun', /^Test/, 'test');
});
