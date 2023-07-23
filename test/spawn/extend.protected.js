'use strict';
/* eslint-disable no-empty-function */
const test = require('../..').extend({
  _lol() {}
});

test('test', async function () {
  this.lol('rofl');
});
