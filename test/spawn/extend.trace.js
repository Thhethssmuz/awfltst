'use strict';

const test = require('../..').extend({
  lol(actual) {
    this.compare((x, y) => x === y, actual, 'lol', 'is lol', {
      operator: 'lol',
      at      : this.trace(1)
    });
  }
});

test('test', async function () {
  this.lol('rofl');
});
