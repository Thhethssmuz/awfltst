'use strict';

const test = require('../..');

test.before(async function () {
  console.log('Top-level before');
});

test('Test 1', async function () {
  test.after(async function () {
    console.log('After 1');
  });
  test.before(async function () {
    console.log('Before 1');
  });

  await this.test('Subtest 1 (inline)', async function () {});

  test.before(async function () {
    console.log('Before 2');
  });
  test.after(async function () {
    console.log('After 2');
  });

  test('Subtest 2 (harness)', function () {});

  test('Subtest 3 (harness)', function () {});

  await this.test('Subtest 4 (inline)', async function () {});

  this.ok(true);
});

test.after(async function () {
  console.log('Top-level after');
});

test('Test 2', async function () {

  test.before(() => console.log('Before all'));
  test.before({group: []}, () => console.log('Before none'));
  test.before({group: 'A'}, () => console.log('Before A'));
  test.before({group: 'B'}, () => console.log('Before B'));
  test.before({group: ['A', 'B']}, () => console.log('Before A or B'));
  test.before({skipGroup: 'A'}, () => console.log('Not before A'));
  test.before({skipGroup: 'B'}, () => console.log('Not before B'));
  test.before({skipGroup: ['A', 'B']}, () => console.log('Not before A or B'));

  test.after(() => console.log('After all'));
  test.after({group: []}, () => console.log('After none'));
  test.after({group: 'A'}, () => console.log('After A'));
  test.after({group: 'B'}, () => console.log('After B'));
  test.after({group: ['A', 'B']}, () => console.log('After A or B'));
  test.after({skipGroup: 'A'}, () => console.log('Not after A'));
  test.after({skipGroup: 'B'}, () => console.log('Not after B'));
  test.after({skipGroup: ['A', 'B']}, () => console.log('Not after A or B'));

  test('none', function () {});
  test('A', {group: 'A'}, function () {});
  test('B', {group: ['B']}, function () {});
  test('A and B', {group: ['A', 'B']}, function () {});
});
