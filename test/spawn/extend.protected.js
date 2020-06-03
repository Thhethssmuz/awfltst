'use strict';

const test = require('../..').extend({
  _lol() {}
});

test('test', async function () {
  this.lol('rofl');
});
