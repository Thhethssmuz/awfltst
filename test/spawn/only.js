'use strict';
/* eslint-disable no-empty-function */
const test = require('../..');

test('test 1', {only: true}, async function () {

  await this.test('sub-test 1 (inline)', async function () {});

  test('sub-test 2 (harness)', async function () {});

  test.only('sub-test 3 (harness)', async function () {});

  await this.test('sub-test 4 (inline)', async function () {}, {only: true});

  await this.test('sub-test 5 (inline)', async function () {});

  test('sub-test 6 (harness)', {only: true}, async function () {});

  this.ok(true);
});

test('test 2', async function () {});
test('test 3', async function () {});
