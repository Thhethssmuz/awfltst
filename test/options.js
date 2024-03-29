'use strict';

const test = require('..');
const exec = require('./exec');

test('options.only', async function () {
  const result = await exec('test/spawn/only.js');
  this.eq(
    result.stdout,
    [
      '',
      '  1 test 1 _ ms',
      '',
      '      1.1 sub-test 1 (inline) _ ms',
      '',
      '      1.2 sub-test 4 (inline) _ ms',
      '',
      '      1.3 sub-test 5 (inline) (skipped)',
      '',
      '    ✔ ok',
      '',
      '      1.4 sub-test 2 (harness) (skipped)',
      '',
      '      1.5 sub-test 3 (harness) _ ms',
      '',
      '      1.6 sub-test 6 (harness) _ ms',
      '',
      '  2 test 2 (skipped)',
      '  3 test 3 (skipped)',
      '',
      '',
      '  All tests passed!',
      '',
      '',
      '  Total:      9 tests   1 assertion',
      '  Passing:    5 tests   1 assertion',
      '  Skipped:    4 tests',
      '  Duration:   _ ms',
      '',
    ],
    'only'
  );
});

test('options.skip', async function () {
  const result = await exec('test/spawn/skip.js');
  this.eq(
    result.stdout,
    [
      '',
      '  1 test 1 _ ms',
      '',
      '      1.1 sub-test 1 (inline) _ ms',
      '',
      '      1.2 sub-test 4 (inline) (skipped)',
      '',
      '      1.3 sub-test 5 (inline) _ ms',
      '',
      '    ✔ ok',
      '',
      '      1.4 sub-test 2 (harness) (skipped)',
      '',
      '      1.5 sub-test 3 (harness) _ ms',
      '',
      '      1.6 sub-test 6 (harness) (skipped)',
      '',
      '  2 test 2 (skipped)',
      '  3 test 3 (skipped)',
      '',
      '',
      '  All tests passed!',
      '',
      '',
      '  Total:      9 tests   1 assertion',
      '  Passing:    4 tests   1 assertion',
      '  Skipped:    5 tests',
      '  Duration:   _ ms',

      '',
    ],
    'skip'
  );
});

test('options.console', async function () {
  let result;

  result = await exec('test/spawn/console.js');
  this.eq(
    result.stdout,
    [
      '',
      '  1 default _ ms',
      '',
      '    line 1',
      '',
      '    ✘ unexpected output to stderr',
      '',
      '      At:       test/spawn/console.js:6:1',
      '      Operator: stderr',
      "      Expected: ''",
      "      Actual:   'line 2\\n'",
      '',
      '  2 captured _ ms',
      '',
      '    line 3',
      '',
      '    ✘ unexpected output to stderr',
      '',
      '      At:       test/spawn/console.js:11:1',
      '      Operator: stderr',
      "      Expected: ''",
      "      Actual:   'line 4\\n'",
      'line 5',
      '',
      '  3 not captured _ ms',
      '',
      '',
      '  Failed Tests: There was 2 failed tests with 2 failed assertions!',
      '',
      '',
      '  Total:      3 tests   2 assertions',
      '  Passing:    1 test    0 assertions',
      '  Failing:    2 tests   2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'default'
  );

  result = await exec('--capture-console', 'test/spawn/console.js');
  this.eq(
    result.stdout,
    [
      '',
      '  1 default _ ms',
      '',
      '    line 1',
      '',
      '    ✘ unexpected output to stderr',
      '',
      '      At:       test/spawn/console.js:6:1',
      '      Operator: stderr',
      "      Expected: ''",
      "      Actual:   'line 2\\n'",
      '',
      '  2 captured _ ms',
      '',
      '    line 3',
      '',
      '    ✘ unexpected output to stderr',
      '',
      '      At:       test/spawn/console.js:11:1',
      '      Operator: stderr',
      "      Expected: ''",
      "      Actual:   'line 4\\n'",
      'line 5',
      '',
      '  3 not captured _ ms',
      '',
      '',
      '  Failed Tests: There was 2 failed tests with 2 failed assertions!',
      '',
      '',
      '  Total:      3 tests   2 assertions',
      '  Passing:    1 test    0 assertions',
      '  Failing:    2 tests   2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'capture on'
  );

  result = await exec('--no-capture-console', 'test/spawn/console.js');
  this.eq(
    result.stdout,
    [
      'line 1',
      '',
      '  1 default _ ms',
      '',
      '  2 captured _ ms',
      '',
      '    line 3',
      '',
      '    ✘ unexpected output to stderr',
      '',
      '      At:       test/spawn/console.js:11:1',
      '      Operator: stderr',
      "      Expected: ''",
      "      Actual:   'line 4\\n'",
      'line 5',
      '',
      '  3 not captured _ ms',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 1 failed assertion!',
      '',
      '',
      '  Total:      3 tests   1 assertion',
      '  Passing:    2 tests   0 assertions',
      '  Failing:    1 test    1 assertion',
      '  Duration:   _ ms',
      '',
    ],
    'capture off'
  );
});
