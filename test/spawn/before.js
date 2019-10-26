'use strict';

const test = require('../..');

test.before(async function () {
  this.pass('before');
});

test.before(async function () {
  this.fail('before');
});

test.before(async function () {
  throw new Error('fail');
});

test('test 1', async function () {
  this.fail('test 1');
});
test('test 2', async function () {
  this.fail('test 2');
});
