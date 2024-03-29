'use strict';

const test = require('..');
const exec = require('./exec');
const NODE_MAJOR = Number.parseInt(process.versions.node.split('.')[0], 10);

test('this.stdout', async function () {
  const result = await exec('test/spawn/stdout.js');

  this.eq(
    result.stdout,
    [
      'line 1',
      'line 2',
      'line 3',
      '',
      '  1 not captured _ ms',
      '',
      '    ✔ not captured, throws',
      '    ✔ clear, not captured, throws',
      '',
      '  2 captured _ ms',
      '',
      '    ✔ captured',
      '    ✔ cleared',
      '',
      '    line 6',
      '',
      '',
      '  All tests passed!',
      '',
      '',
      '  Total:      2 tests   4 assertions',
      '  Passing:    2 tests   4 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );

  this.eq(result.code, 0, 'exit code');
});

test('this.stderr', async function () {
  const result = await exec('test/spawn/stderr.js');

  this.chain('spec output')
    .eq(
      result.stdout,
      [
        '',
        '  1 not captured _ ms',
        '',
        '    ✔ not captured, throws',
        '    ✔ clear, not captured, throws',
        '',
        '  2 captured _ ms',
        '',
        '    line 4',
        '    line 6',
        '',
        '    ✔ captured',
        '    ✔ cleared',
        '',
        '    line 8',
        '',
        '    ✘ unexpected output to stderr',
        '',
        '      At:       test/spawn/stderr.js:22:1',
        '      Operator: stderr',
        "      Expected: ''",
        "      Actual:   'line 9\\n'",
        '',
        '',
        '  Failed Tests: There was 1 failed test with 1 failed assertion!',
        '',
        '',
        '  Total:      2 tests   5 assertions',
        '  Passing:    1 test    4 assertions',
        '  Failing:    1 test    1 assertion',
        '  Duration:   _ ms',
        '',
      ],
      'stdout'
    )
    .eq(result.stderr, ['line 1', 'line 2', 'line 3', '    line 9'], 'stderr');

  this.eq(result.code, 1, 'exit code');
});

test('this.trace', async function () {
  const result = await exec('test/spawn/trace.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    test/spawn/trace.js:8:19',
      '    test/spawn/trace.js:9:19',
      '    test/spawn/trace.js:10:28',
      '    test/spawn/trace.js:13:17',
      '    test/spawn/trace.js:16:17',
      '    test/spawn/trace.js:20:6',
      '',
      '  2 eval _ ms',
      '',
      '    test/spawn/trace.js:25:43',
      '    test/spawn/trace.js:27:7',
      '',
      '',
      '  All tests passed!',
      '',
      '',
      '  Total:      2 tests   0 assertions',
      '  Passing:    2 tests   0 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.plan', async function () {
  const result = await exec('test/spawn/plan.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ pass',
      '',
      '  2 (anonymous) _ ms',
      '',
      '    ✔ pass',
      '',
      '  3 (anonymous) _ ms',
      '',
      '    ✔ pass',
      '',
      '    ✘ number of assertions != plan',
      '',
      '      At:       test/spawn/plan.js:16:8',
      '      Operator: plan',
      '      Expected: 2',
      '      Actual:   1',
      '',
      '  4 (anonymous) _ ms',
      '',
      '    ✔ pass',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/plan.js:21:8',
      '      Operator: plan',
      '      Expected: 2',
      '      Actual:   1',
      '',
      '',
      '  Failed Tests: There was 2 failed tests with 2 failed assertions!',
      '',
      '',
      '  Total:      4 tests   6 assertions',
      '  Passing:    2 tests   4 assertions',
      '  Failing:    2 tests   2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.compare', async function () {
  const result = await exec('test/spawn/compare.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ comparator must be a function',
      '    ✔ actual must be specified',
      '    ✔ expected must be specified',
      '    ✔ compare',
      '    ✔ f',
      '    ✔ test',
      '',
      '    ✘ compare',
      '',
      '      At:       test/spawn/compare.js:28:8',
      '      Operator: compare',
      '      Expected: 1',
      '      Actual:   1',
      '',
      '    ✘ lol',
      '',
      '      At:       test/spawn/compare.js:29:8',
      '      Operator: lol',
      '      Expected: 1',
      '      Actual:   1',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/compare.js:30:8',
      '      Operator: lol',
      '      Expected: 1',
      '      Actual:   1',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 3 failed assertions!',
      '',
      '',
      '  Total:      1 test    9 assertions',
      '  Passing:    0 tests   6 assertions',
      '  Failing:    1 test    3 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.chain', async function () {
  const result = await exec('test/spawn/chain.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ chain',
      '      ✔ pass',
      '    ✔ test',
      '      ✔ pass',
      '',
      '    ✘ chain',
      '',
      '      ✘ fail',
      '',
      '        At:       test/spawn/chain.js:10:16',
      '        Operator: fail',
      '',
      '    ✘ test',
      '',
      '      ✘ fail',
      '',
      '        At:       test/spawn/chain.js:11:22',
      '        Operator: fail',
      '',
      '    ✔ chain',
      '      ✔ chain',
      '        ✔ pass',
      '',
      '    ✘ chain',
      '',
      '      ✘ chain',
      '',
      '        ✘ fail',
      '',
      '          At:       test/spawn/chain.js:14:24',
      '          Operator: fail',
      '',
      '    ✔ chain',
      '      ✔ chain',
      '        ✔ pass',
      '      ✔ pass',
      '      ✔ chain',
      '        ✔ pass',
      '      ✔ pass',
      '    ✔ pass',
      '    ✔ pass',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 7 failed assertions!',
      '',
      '',
      '  Total:      1 test    23 assertions',
      '  Passing:    0 tests   16 assertions',
      '  Failing:    1 test    7 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.pass', async function () {
  const result = await exec('test/spawn/pass.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ pass',
      '    ✔ test',
      '',
      '',
      '  All tests passed!',
      '',
      '',
      '  Total:      1 test    2 assertions',
      '  Passing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.fail', async function () {
  const result = await exec('test/spawn/fail.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✘ fail',
      '',
      '      At:       test/spawn/fail.js:6:8',
      '      Operator: fail',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/fail.js:7:8',
      '      Operator: fail',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    2 assertions',
      '  Passing:    0 tests   0 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.error', async function () {
  const result = await exec('test/spawn/error.js');

  // filter stack lines as these might be inconsistent
  result.stdout = result.stdout.filter((x) => !/^\s+ at /.test(x));

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✘ error',
      '',
      '      At:       test/spawn/error.js:6:8',
      '      Operator: error',
      '      Actual:',
      '        Error: test',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/error.js:7:8',
      '      Operator: error',
      '      Actual:',
      '        Error: test',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    2 assertions',
      '  Passing:    0 tests   0 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.ok', async function () {
  const result = await exec('test/spawn/ok.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ ok',
      '    ✔ test',
      '',
      '    ✘ ok',
      '',
      '      At:       test/spawn/ok.js:8:8',
      '      Operator: ok',
      '      Expected: true',
      '      Actual:   false',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/ok.js:9:8',
      '      Operator: ok',
      '      Expected: true',
      "      Actual:   ''",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.not', async function () {
  const result = await exec('test/spawn/not.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ not',
      '    ✔ test',
      '',
      '    ✘ not',
      '',
      '      At:       test/spawn/not.js:8:8',
      '      Operator: not',
      '      Expected: false',
      '      Actual:   true',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/not.js:9:8',
      '      Operator: not',
      '      Expected: false',
      '      Actual:   1',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.eq', async function () {
  const result = await exec('--depth=10', 'test/spawn/eq.js');

  this.eq(
    result.stdout,
    NODE_MAJOR < 11
      ? [
          '',
          '  1 (anonymous) _ ms',
          '',
          '    ✔ equals 1',
          '    ✔ test',
          '',
          '    ✘ equals [Object]',
          '',
          '      At:       test/spawn/eq.js:8:8',
          '      Operator: eq',
          '      Expected: { b: 2 }',
          '      Actual:   { a: 1 }',
          '',
          '    ✘ test',
          '',
          '      At:       test/spawn/eq.js:9:8',
          '      Operator: eq',
          '      Expected: [ 1, 2, 3 ]',
          "      Actual:   [ 1, '2', 'three' ]",
          '',
          '  2 diffable _ ms',
          '',
          '    ✘ equals [Object]',
          '',
          '      At:       test/spawn/eq.js:36:8',
          '      Operator: eq',
          '      Expected: -',
          '      Actual:   +',
          '        - { boolean: false,',
          '        + { boolean: true,',
          '            null: null,',
          '            number: [ NaN, 0, -0, Infinity ],',
          '            object:',
          "        -    { nested: { a: { b: { c: 'c' } } },",
          "        +    { nested: { a: { b: { c: 'not c' } } },",
          '               null: [Object: null prototype] {} },',
          '            regexp: /test/i,',
          "            string: '',",
          '            symbol: Symbol(test),',
          '            undefined: undefined }',
          '',
          '  3 undiffable _ ms',
          '',
          '    ✘ equals [Object]',
          '',
          '      At:       test/spawn/eq.js:40:8',
          '      Operator: eq',
          '      Expected:',
          '        { null: null,',
          '          undefined: undefined,',
          '          boolean: false,',
          '          number: [ NaN, 0, -0, Infinity ],',
          "          string: '',",
          '          regexp: /test/i,',
          '          symbol: Symbol(test),',
          '          object:',
          '           { null: [Object: null prototype] {},',
          "             nested: { a: { b: { c: 'c' } } } } }",
          '      Actual:',
          '        { null: null,',
          '          undefined: undefined,',
          '          boolean: true,',
          '          number: [ NaN, 0, -0, Infinity ],',
          "          string: '',",
          '          regexp: /test/i,',
          '          symbol: Symbol(test),',
          '          object:',
          '           { null: [Object: null prototype] {},',
          "             nested: { a: { b: { c: 'not c' } } } } }",
          '',
          '',
          '  Failed Tests: There was 3 failed tests with 4 failed assertions!',
          '',
          '',
          '  Total:      3 tests   6 assertions',
          '  Passing:    0 tests   2 assertions',
          '  Failing:    3 tests   4 assertions',
          '  Duration:   _ ms',
          '',
        ]
      : [
          '',
          '  1 (anonymous) _ ms',
          '',
          '    ✔ equals 1',
          '    ✔ test',
          '',
          '    ✘ equals [Object]',
          '',
          '      At:       test/spawn/eq.js:8:8',
          '      Operator: eq',
          '      Expected: { b: 2 }',
          '      Actual:   { a: 1 }',
          '',
          '    ✘ test',
          '',
          '      At:       test/spawn/eq.js:9:8',
          '      Operator: eq',
          '      Expected: [ 1, 2, 3 ]',
          "      Actual:   [ 1, '2', 'three' ]",
          '',
          '  2 diffable _ ms',
          '',
          '    ✘ equals [Object]',
          '',
          '      At:       test/spawn/eq.js:36:8',
          '      Operator: eq',
          '      Expected: -',
          '      Actual:   +',
          '          {',
          '        -   boolean: false,',
          '        +   boolean: true,',
          '            null: null,',
          '            number: [ NaN, 0, -0, Infinity ],',
          '            object: {',
          "        -     nested: { a: { b: { c: 'c' } } },",
          "        +     nested: { a: { b: { c: 'not c' } } },",
          '              null: [Object: null prototype] {}',
          '            },',
          '            regexp: /test/i,',
          "            string: '',",
          '            symbol: Symbol(test),',
          '            undefined: undefined',
          '          }',
          '',
          '  3 undiffable _ ms',
          '',
          '    ✘ equals [Object]',
          '',
          '      At:       test/spawn/eq.js:40:8',
          '      Operator: eq',
          '      Expected:',
          '        {',
          '          null: null,',
          '          undefined: undefined,',
          '          boolean: false,',
          '          number: [ NaN, 0, -0, Infinity ],',
          "          string: '',",
          '          regexp: /test/i,',
          '          symbol: Symbol(test),',
          '          object: {',
          '            null: [Object: null prototype] {},',
          "            nested: { a: { b: { c: 'c' } } }",
          '          }',
          '        }',
          '      Actual:',
          '        {',
          '          null: null,',
          '          undefined: undefined,',
          '          boolean: true,',
          '          number: [ NaN, 0, -0, Infinity ],',
          "          string: '',",
          '          regexp: /test/i,',
          '          symbol: Symbol(test),',
          '          object: {',
          '            null: [Object: null prototype] {},',
          "            nested: { a: { b: { c: 'not c' } } }",
          '          }',
          '        }',
          '',
          '',
          '  Failed Tests: There was 3 failed tests with 4 failed assertions!',
          '',
          '',
          '  Total:      3 tests   6 assertions',
          '  Passing:    0 tests   2 assertions',
          '  Failing:    3 tests   4 assertions',
          '  Duration:   _ ms',
          '',
        ],
    'spec output'
  );
});

test('this.ne', async function () {
  const result = await exec('test/spawn/ne.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ not equals 2',
      '    ✔ test',
      '',
      '    ✘ not equals [Object]',
      '',
      '      At:       test/spawn/ne.js:8:8',
      '      Operator: ne',
      '      Expected: { a: 1 }',
      '      Actual:   { a: 1 }',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/ne.js:9:8',
      '      Operator: ne',
      '      Expected: [ 1, 2, 3 ]',
      '      Actual:   [ 1, 2, 3 ]',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.gt', async function () {
  const result = await exec('test/spawn/gt.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ greater than 0',
      '    ✔ test',
      '',
      '    ✘ greater than 1',
      '',
      '      At:       test/spawn/gt.js:8:8',
      '      Operator: gt',
      '      Expected: 1',
      '      Actual:   0',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/gt.js:9:8',
      '      Operator: gt',
      "      Expected: 'alpha'",
      "      Actual:   'alpha'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.gte', async function () {
  const result = await exec('test/spawn/gte.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ greater than or equal to 0',
      '    ✔ test',
      '',
      '    ✘ greater than or equal to 1',
      '',
      '      At:       test/spawn/gte.js:8:8',
      '      Operator: gte',
      '      Expected: 1',
      '      Actual:   0',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/gte.js:9:8',
      '      Operator: gte',
      "      Expected: 'beta'",
      "      Actual:   'alpha'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.lte', async function () {
  const result = await exec('test/spawn/lte.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ less than or equal to 0',
      '    ✔ test',
      '',
      '    ✘ less than or equal to 0',
      '',
      '      At:       test/spawn/lte.js:8:8',
      '      Operator: lte',
      '      Expected: 0',
      '      Actual:   1',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/lte.js:9:8',
      '      Operator: lte',
      "      Expected: 'alpha'",
      "      Actual:   'beta'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.lt', async function () {
  const result = await exec('test/spawn/lt.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ less than 1',
      '    ✔ test',
      '',
      '    ✘ less than 0',
      '',
      '      At:       test/spawn/lt.js:8:8',
      '      Operator: lt',
      '      Expected: 0',
      '      Actual:   0',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/lt.js:9:8',
      '      Operator: lt',
      "      Expected: 'alpha'",
      "      Actual:   'beta'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.between', async function () {
  const result = await exec('test/spawn/between.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ between 0 and 10',
      '    ✔ test',
      '',
      '    ✘ between 0 and 10',
      '',
      '      At:       test/spawn/between.js:8:8',
      '      Operator: between',
      '      Expected: [ 0, 10 ]',
      '      Actual:   99',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/between.js:9:8',
      '      Operator: between',
      '      Expected: [ 0, 10 ]',
      '      Actual:   -1',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.notBetween', async function () {
  const result = await exec('test/spawn/not-between.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ not between 0 and 10',
      '    ✔ test',
      '',
      '    ✘ not between 0 and 10',
      '',
      '      At:       test/spawn/not-between.js:8:8',
      '      Operator: notBetween',
      '      Expected: [ 0, 10 ]',
      '      Actual:   0',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/not-between.js:9:8',
      '      Operator: notBetween',
      '      Expected: [ 0, 10 ]',
      '      Actual:   5',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.approx', async function () {
  const result = await exec('test/spawn/approx.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ approximately equals 100 ± 5',
      '    ✔ test',
      '',
      '    ✘ approximately equals 100 ± 5',
      '',
      '      At:       test/spawn/approx.js:8:8',
      '      Operator: approx',
      '      Expected: 100 ± 5',
      '      Actual:   106',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/approx.js:9:8',
      '      Operator: approx',
      '      Expected: 0 ± 0.001',
      '      Actual:   0.0123',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.contains', async function () {
  const result = await exec('test/spawn/contains.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ contains 1',
      '    ✔ test',
      '',
      '    ✘ contains 1',
      '',
      '      At:       test/spawn/contains.js:8:8',
      '      Operator: contains',
      '      Expected: 1',
      '      Actual:   [ 0 ]',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/contains.js:9:8',
      '      Operator: contains',
      '      Expected: 1',
      '      Actual:   null',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.notContains', async function () {
  const result = await exec('test/spawn/not-contains.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ does not contain 0',
      '    ✔ test',
      '',
      '    ✘ does not contain 0',
      '',
      '      At:       test/spawn/not-contains.js:8:8',
      '      Operator: notContains',
      '      Expected: 0',
      '      Actual:   [ 0, 1 ]',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/not-contains.js:9:8',
      '      Operator: notContains',
      "      Expected: 'b'",
      "      Actual:   'abc'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.in', async function () {
  const result = await exec('test/spawn/in.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ in [ 1, 2, 3 ]',
      '    ✔ test',
      '',
      '    ✘ in [ 1, 2, 3 ]',
      '',
      '      At:       test/spawn/in.js:8:10',
      '      Operator: in',
      '      Expected: [ 1, 2, 3 ]',
      '      Actual:   0',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/in.js:9:10',
      '      Operator: in',
      "      Expected: 'abc'",
      '      Actual:   null',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.notIn', async function () {
  const result = await exec('test/spawn/not-in.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ not in [ 1, 2, 3 ]',
      '    ✔ test',
      '',
      '    ✘ not in [ 1, 2, 3 ]',
      '',
      '      At:       test/spawn/not-in.js:8:8',
      '      Operator: notIn',
      '      Expected: [ 1, 2, 3 ]',
      '      Actual:   1',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/not-in.js:9:8',
      '      Operator: notIn',
      "      Expected: 'abc'",
      "      Actual:   'bc'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.type', async function () {
  const result = await exec('test/spawn/type.js');

  // filter stack lines as these might be inconsistent
  result.stdout = result.stdout.filter((x) => !/^\s+ at /.test(x));

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      "    ✔ is type of 'number'",
      '    ✔ test',
      '',
      "    ✘ is type of 'number'",
      '',
      '      At:       test/spawn/type.js:8:8',
      '      Operator: type',
      "      Expected: 'number'",
      '      Actual:   null',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/type.js:9:8',
      '      Operator: type',
      "      Expected: 'string'",
      '      Actual:   1',
      '',
      '    ✘ uncaught error',
      '',
      '      At:       test/spawn/type.js:5:1',
      '      Operator: error',
      '      Actual:',
      '        TypeError: invalid type',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 3 failed assertions!',
      '',
      '',
      '  Total:      1 test    5 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    3 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.instance', async function () {
  const result = await exec('test/spawn/instance.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ is instance of Array',
      '    ✔ test',
      '',
      '    ✘ is instance of Array',
      '',
      '      At:       test/spawn/instance.js:8:8',
      '      Operator: instance',
      '      Expected: [Function: Array]',
      '      Actual:   null',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/instance.js:9:8',
      '      Operator: instance',
      '      Expected: [Function: Object]',
      '      Actual:   1',
      '',
      '    ✘ is instance of anonymous',
      '',
      '      At:       test/spawn/instance.js:10:8',
      '      Operator: instance',
      NODE_MAJOR < 13
        ? '      Expected: [Function]'
        : '      Expected: [Function (anonymous)]',
      '      Actual:   1',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 3 failed assertions!',
      '',
      '',
      '  Total:      1 test    5 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    3 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.has', async function () {
  const result = await exec('test/spawn/has.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      "    ✔ has property 'x'",
      '    ✔ test',
      '',
      "    ✘ has property 'lol'",
      '',
      '      At:       test/spawn/has.js:8:8',
      '      Operator: has',
      "      Expected: 'lol'",
      '      Actual:   null',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/has.js:9:8',
      '      Operator: has',
      "      Expected: 'fun'",
      '      Actual:   {}',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.lack', async function () {
  const result = await exec('test/spawn/lack.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      "    ✔ lack property 'undefined'",
      '    ✔ test',
      '',
      "    ✘ lack property 'test'",
      '',
      '      At:       test/spawn/lack.js:8:8',
      '      Operator: lack',
      "      Expected: 'test'",
      '      Actual:   { test: true }',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/lack.js:9:8',
      '      Operator: lack',
      "      Expected: 'a'",
      '      Actual:   { a: 1, b: 2 }',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.match', async function () {
  const result = await exec('test/spawn/match.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ matches /test/i',
      '    ✔ test',
      '',
      '    ✘ matches /null/i',
      '',
      '      At:       test/spawn/match.js:8:8',
      '      Operator: match',
      '      Expected: /null/i',
      '      Actual:   null',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/match.js:9:8',
      '      Operator: match',
      '      Expected: /test/i',
      "      Actual:   'fun'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.match', async function () {
  const result = await exec('test/spawn/not-match.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ does not match /null/i',
      '    ✔ test',
      '',
      '    ✘ does not match /test/i',
      '',
      '      At:       test/spawn/not-match.js:8:8',
      '      Operator: notMatch',
      '      Expected: /test/i',
      "      Actual:   'Testing is fun'",
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/not-match.js:9:8',
      '      Operator: notMatch',
      '      Expected: /^Test/',
      "      Actual:   'Testing is fun'",
      '',
      '',
      '  Failed Tests: There was 1 failed test with 2 failed assertions!',
      '',
      '',
      '  Total:      1 test    4 assertions',
      '  Passing:    0 tests   2 assertions',
      '  Failing:    1 test    2 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.test', async function () {
  const result = await exec('test/spawn/test.js');

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '      1.1 (anonymous) _ ms',
      '',
      '        ✔ pass',
      '',
      '      1.2 test _ ms',
      '',
      '        ✔ pass',
      '',
      '      1.3 (anonymous) (skipped)',
      '      1.4 test (skipped)',
      '',
      '      1.5 (anonymous) _ ms',
      '',
      '        ✘ uncaught error',
      '',
      '          At:       test/spawn/test.js:18:14',
      '          Operator: error',
      '          Actual:   null',
      '',
      '      1.6 test _ ms',
      '',
      '        ✘ fail',
      '',
      '          At:       test/spawn/test.js:23:10',
      '          Operator: fail',
      '',
      '  2 (anonymous) _ ms',
      '',
      '    ✔ test function required',
      '',
      '      2.1 (anonymous) _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.2 name _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.3 name _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.4 (anonymous) _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.5 (anonymous) _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.6 name _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.7 name _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.8 name _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.9 name _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.10 name _ ms',
      '',
      '        ✔ pass',
      '',
      '      2.11 name _ ms',
      '',
      '        ✔ pass',
      '',
      '',
      '  Failed Tests: There was 3 failed tests with 2 failed assertions!',
      '',
      '',
      '  Total:      19 tests   16 assertions',
      '  Passing:    14 tests   14 assertions',
      '  Failing:    3 tests   2 assertions',
      '  Skipped:    2 tests',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.throws', async function () {
  const result = await exec('test/spawn/throws.js');

  // filter stack lines as these might be inconsistent
  result.stdout = result.stdout.filter((x) => !/^\s+ at /.test(x));

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ throws',
      '    ✔ test',
      '',
      '    ✘ throws [Function: TypeError]',
      '',
      '      At:       test/spawn/throws.js:12:14',
      '      Operator: throws',
      '      Expected: [Function: TypeError]',
      '      Actual:',
      '        ReferenceError: x is not defined',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/throws.js:16:14',
      '      Operator: throws',
      '      Expected: /test/',
      '      Actual:',
      '        TypeError: lol',
      '',
      '    ✔ plain',
      '',
      '    ✘ plain',
      '',
      '      At:       test/spawn/throws.js:20:14',
      '      Operator: throws',
      '      Expected: undefined',
      '      Actual:   undefined',
      '',
      '  2 (anonymous) _ ms',
      '',
      '    ✘ throws',
      '',
      "      ✔ equals 'TypeError'",
      '',
      '      ✘ equals 1',
      '',
      '        At:       test/spawn/throws.js:33:10',
      '        Operator: eq',
      '        Expected: 1',
      '        Actual:   123',
      '',
      '    ✘ throws',
      '',
      '      At:       test/spawn/throws.js:35:14',
      '      Operator: throws',
      NODE_MAJOR < 13
        ? '      Expected: [Function]'
        : '      Expected: [Function (anonymous)]',
      '      Actual:   undefined',
      '',
      '    ✔ throws a very special error',
      '    ✔ name',
      '    ✔ code',
      '    ✔ throws',
      '',
      '',
      '  Failed Tests: There was 2 failed tests with 6 failed assertions!',
      '',
      '',
      '  Total:      2 tests   14 assertions',
      '  Passing:    0 tests   8 assertions',
      '  Failing:    2 tests   6 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});

test('this.notThrows', async function () {
  const result = await exec('test/spawn/not-throws.js');

  // filter stack lines as these might be inconsistent
  result.stdout = result.stdout.filter((x) => !/^\s+ at /.test(x));

  this.eq(
    result.stdout,
    [
      '',
      '  1 (anonymous) _ ms',
      '',
      '    ✔ does not throw',
      '    ✔ test',
      '',
      '    ✘ does not throw',
      '',
      '      At:       test/spawn/not-throws.js:8:14',
      '      Operator: notThrows',
      '      Expected: undefined',
      '      Actual:',
      '        ReferenceError: x is not defined',
      '',
      '    ✘ test',
      '',
      '      At:       test/spawn/not-throws.js:12:14',
      '      Operator: notThrows',
      '      Expected: undefined',
      '      Actual:',
      '        TypeError: lol',
      '',
      '    ✔ plain',
      '',
      '    ✘ plain',
      '',
      '      At:       test/spawn/not-throws.js:16:14',
      '      Operator: notThrows',
      '      Expected: undefined',
      '      Actual:   2',
      '',
      '',
      '  Failed Tests: There was 1 failed test with 3 failed assertions!',
      '',
      '',
      '  Total:      1 test    6 assertions',
      '  Passing:    0 tests   3 assertions',
      '  Failing:    1 test    3 assertions',
      '  Duration:   _ ms',
      '',
    ],
    'spec output'
  );
});
