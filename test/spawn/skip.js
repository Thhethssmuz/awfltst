'use strict';

const test = require('../..');

test('test 1', async function () {

  await this.test('sub-test 1 (inline)', async function () {});

  test('sub-test 2 (harness)', async function () {}, {skip: true});

  test('sub-test 3 (harness)', async function () {});

  await this.test('sub-test 4 (inline)', {skip: true}, async function () {});

  await this.test('sub-test 5 (inline)', async function () {});

  test.skip('sub-test 6 (harness)', async function () {});

  this.ok(true);
});

test.skip('test 2', async function () {});
test('test 3', async function () {}, {skip: true});
