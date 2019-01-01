'use strict';

const test = require('../..');

test(async function () {
  await this.throws(function () {
    throw new Error('test');
  });
  await this.throws(async function () {
    throw new Error('test');
  }, Error, 'test');
  await this.throws(function () {
    // eslint-disable-next-line no-undef, no-unused-expressions
    x;
  }, TypeError);
  await this.throws(async function () {
    throw TypeError('lol');
  }, /test/, 'test');
  await this.throws(Promise.reject(1), 'plain');
  await this.throws(Promise.resolve(2), 'plain');
});
