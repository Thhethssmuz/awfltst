'use strict';
/* eslint-disable no-console, no-empty-function */
const test = require('../..');

test.after({once: true}, async function () {
  console.log('Top-level after (once)');
});

test.after(async function () {
  console.log('Top-level after');
});

test('mixed', async function () {
  test.after(async function () {
    console.log('After 1');
  });

  await this.test('Subtest 1 (inline)', async function () {});

  test.after(async function () {
    console.log('After 2');
  });

  test('Subtest 2 (harness)', function () {});

  test('Subtest 3 (harness)', function () {});

  await this.test('Subtest 4 (inline)', async function () {});

  this.ok(true);
});

test(async function () {});
