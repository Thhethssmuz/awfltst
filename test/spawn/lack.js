'use strict';

const test = require('../..');

test(async function () {
  this.lack(undefined, 'undefined');
  this.lack({fun: 2}, 2, 'test');
  this.lack({test: true}, 'test');
  this.lack({a: 1, b: 2}, 'a', 'test');
});
