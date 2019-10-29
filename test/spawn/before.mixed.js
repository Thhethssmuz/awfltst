'use strict';

const test = require('../..');

test.before({once: true}, async function () {
  console.log('Top-level before (once)');
});

test.before(async function () {
  console.log('Top-level before');
});

test('mixed', async function () {
  test.before(async function () {
    console.log('Before 1');
  });

  await this.test('Subtest 1 (inline)', async function () {});

  test.before(async function () {
    console.log('Before 2');
  });

  test('Subtest 2 (harness)', function () {});

  test('Subtest 3 (harness)', function () {});

  await this.test('Subtest 4 (inline)', async function () {});

  this.ok(true);
});

test(async function () {});
