'use strict';

const test = require('..');
const exec = require('./exec');

test('test await', async function () {
  const result = await exec('test/spawn/await.js');
  this.eq(
    result.stdout,
    [
      '',
      '  1 await _ ms',
      '',
      '    ✘ test completed before all asynchronous subcomponents',
      '',
      '      At:       test/spawn/await.js:6:1',
      '      Operator: trailingAsync',
      '      Expected: 0',
      '      Actual:   3',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 1 failed assertion!',
      '',
      '',
      '  Total:      1 test    1 assertion',
      '  Passing:    0 tests   0 assertions',
      '  Failing:    1 test    1 assertion',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('test exit', async function () {
  let result;

  result = await exec('--only=exit-0', 'test/spawn/exit.js');
  this.chain('exit-0')
    .eq(
      result.stdout,
      [
        '',
        '  1 exit-0 _ ms',
        '',
        '    ✘ premature exit before test completion',
        '',
        '      At:       test/spawn/exit.js:10:1',
        '      Operator: process.exit',
        '',
        '',
        '  Failed Tests: There was 1 failed test with 1 failed assertion!',
        '',
        '',
        '  Total:      1 test    1 assertion',
        '  Passing:    0 tests   0 assertions',
        '  Failing:    1 test    1 assertion',
        '  Duration:   _ ms',
        '',
      ],
      'spec output'
    )
    .eq(result.stderr, [], 'stderr is empty')
    .eq(result.code, 1, 'exit code');

  result = await exec('--only=exit-1', 'test/spawn/exit.js');
  this.chain('exit-1')
    .eq(
      result.stdout,
      [
        '',
        '  1 exit-0 (skipped)',
        '',
        '  2 exit-1 _ ms',
        '',
        '    ✘ premature exit before test completion',
        '',
        '      At:       test/spawn/exit.js:15:1',
        '      Operator: process.exit',
        '',
        '',
        '  Failed Tests: There was 1 failed test with 1 failed assertion!',
        '',
        '',
        '  Total:      2 tests   1 assertion',
        '  Passing:    0 tests   0 assertions',
        '  Failing:    1 test    1 assertion',
        '  Skipped:    1 test',
        '  Duration:   _ ms',
        '',
      ],
      'spec output'
    )
    .eq(result.stderr, [], 'stderr is empty')
    .eq(result.code, 1, 'exit code');

  result = await exec('--only=uncaught', 'test/spawn/exit.js');
  this.chain('uncaught')
    .eq(
      result.stdout,
      [
        '',
        '  1 exit-0 (skipped)',
        '  2 exit-1 (skipped)',
        '',
        '  3 uncaught _ ms',
        '',
        '    ✘ premature exit before test completion',
        '',
        '      At:       test/spawn/exit.js:20:1',
        '      Operator: process.exit',
        '',
        '',
        '  Failed Tests: There was 1 failed test with 1 failed assertion!',
        '',
        '',
        '  Total:      3 tests   1 assertion',
        '  Passing:    0 tests   0 assertions',
        '  Failing:    1 test    1 assertion',
        '  Skipped:    2 tests',
        '  Duration:   _ ms',
        '',
      ],
      'spec output'
    )
    .ne(result.stderr, [], 'stderr is not empty')
    .contains(
      result.stderr[1],
      "throw new Error('lol')",
      'stderr contains error'
    )
    .eq(result.code, 1, 'exit code');

  result = await exec('--only=nested', 'test/spawn/exit.js');
  this.chain('nested')
    .eq(
      result.stdout,
      [
        '',
        '  1 exit-0 (skipped)',
        '  2 exit-1 (skipped)',
        '  3 uncaught (skipped)',
        '',
        '  4 nested _ ms',
        '',
        '    outer',
        '',
        '      4.1 subtest _ ms',
        '',
        '        inner',
        '',
        '        ✘ premature exit before test completion',
        '',
        '          At:       test/spawn/exit.js:27:14',
        '          Operator: process.exit',
        '',
        '',
        '  Failed Tests: There was 2 failed tests with 1 failed assertion!',
        '',
        '',
        '  Total:      5 tests   1 assertion',
        '  Passing:    0 tests   0 assertions',
        '  Failing:    2 tests   1 assertion',
        '  Skipped:    3 tests',
        '  Duration:   _ ms',
        '',
      ],
      'spec output'
    )
    .ne(result.stderr, [], 'stderr is not empty')
    .contains(
      result.stderr[1],
      "throw new Error('lol')",
      'stderr contains error'
    )
    .eq(result.code, 1, 'exit code');
});

test('test esm', async function () {
  const result = await exec(
    '--filename',
    '--summary',
    'test/spawn/ok.js',
    'test/spawn/ok.mjs'
  );

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms test/spawn/ok.js:5:1',
      '',
      '    ✔ ok',
      '    ✔ test',
      '',
      '    ✘ ok test/spawn/ok.js:8:8',
      '',
      '      At:       test/spawn/ok.js:8:8',
      '      Operator: ok',
      '      Expected: true',
      '      Actual:   false',
      '',
      '    ✘ test test/spawn/ok.js:9:8',
      '',
      '      At:       test/spawn/ok.js:9:8',
      '      Operator: ok',
      '      Expected: true',
      "      Actual:   ''",
      '',
      '  2 (anonymous) _ ms test/spawn/ok.mjs:3:1',
      '',
      '    ✔ ok',
      '    ✔ test',
      '',
      '    ✘ ok test/spawn/ok.mjs:6:8',
      '',
      '      At:       test/spawn/ok.mjs:6:8',
      '      Operator: ok',
      '      Expected: true',
      '      Actual:   false',
      '',
      '    ✘ test test/spawn/ok.mjs:7:8',
      '',
      '      At:       test/spawn/ok.mjs:7:8',
      '      Operator: ok',
      '      Expected: true',
      "      Actual:   ''",
      '',
      '',
      '  Failed Tests: There was 2 failed tests with 4 failed assertions!',
      '',
      '  1 (anonymous) _ ms test/spawn/ok.js:5:1',
      '    ✘ ok test/spawn/ok.js:8:8',
      '    ✘ test test/spawn/ok.js:9:8',
      '  2 (anonymous) _ ms test/spawn/ok.mjs:3:1',
      '    ✘ ok test/spawn/ok.mjs:6:8',
      '    ✘ test test/spawn/ok.mjs:7:8',
      '',
      '',
      '  Total:      2 tests   8 assertions',
      '  Passing:    0 tests   4 assertions',
      '  Failing:    2 tests   4 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});
