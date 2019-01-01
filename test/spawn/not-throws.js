'use strict';

const test = require('../..');

test(async function () {
  await this.notThrows(function () {});
  await this.notThrows(async function () {}, 'test');
  await this.notThrows(function () {
    // eslint-disable-next-line no-undef, no-unused-expressions
    x;
  });
  await this.notThrows(async function () {
    throw TypeError('lol');
  }, 'test');
  await this.notThrows(Promise.resolve(1), 'plain');
  await this.notThrows(Promise.reject(2), 'plain');
});
