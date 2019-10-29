'use strict';

const test = require('../..');

test.after(async function () {
  this.pass('after');
});

test.after(async function () {
  this.fail('after');
});

test.after(async function () {
  throw new Error('fail');
});

test('test 1', async function () {
  this.pass('test 1');
});
test('test 2', async function () {
  this.pass('test 2');
});
