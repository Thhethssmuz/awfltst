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

test(async function () {

  const f = (code) => () => {
    const err = new TypeError('test');
    err.code = code;
    throw err;
  };

  await this.throws(f(123), function (err) {
    this.eq(err.name, 'TypeError');
    this.eq(err.code, 1);
  });
  await this.throws(() => {}, () => {});
  await this.throws(f(1), (err) => {
    this.eq(err.name, 'TypeError', 'name');
    this.eq(err.code, 1, 'code');
  }, 'throws a very special error');
  await this.throws(f(1), function () {});
});
