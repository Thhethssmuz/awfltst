'use strict';

const test = require('../..');

test('test', async function () {
  this.pass();
  await this.test('sub-test inherit', async function () {
    this.pass();
  });
  await this.test('sub-test override', {skip: true}, async function () {
    this.fail();
  });
});

test('should be skipped', {skip: true}, async function () {
  this.fail();
});
