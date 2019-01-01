'use strict';

const test = require('../..');

test('test', {only: true}, async function () {
  this.pass();
  await this.test('sub-test inherit', function () {
    this.pass();
  });
  await this.test('sub-test override', {only: false}, function () {
    this.pass();
  });
});

test('should be skipped', async function () {
  this.fail();
});
