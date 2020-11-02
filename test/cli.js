'use strict';

const test = require('..');
const exec = require('./exec');
const {PassThrough} = require('stream');


test('cli --only', async function () {
  let result;

  result = await exec('test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    5 tests   0 assertions',
    '  Duration:   _ ms',
    ''], '--');

  result = await exec('-tlol', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '  2 test 2 [] (skipped)',
    '  3 test 3 [a] (skipped)',
    '  4 test 4 [b] (skipped)',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    0 tests   0 assertions',
    '  Skipped:    5 tests',
    '  Duration:   _ ms',
    ''], '--only lol');

  result = await exec('--only=test 1 -', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] (skipped)',
    '  3 test 3 [a] (skipped)',
    '  4 test 4 [b] (skipped)',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    1 test    0 assertions',
    '  Skipped:    4 tests',
    '  Duration:   _ ms',
    ''], '--only "test 1"');

  result = await exec('--only', 'test 2 []', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] (skipped)',
    '  4 test 4 [b] (skipped)',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    1 test    0 assertions',
    '  Skipped:    4 tests',
    '  Duration:   _ ms',
    ''], '--only "test 2"');

  result = await exec('-ttest 3 [a]', '-ttest 4 [b]', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '  2 test 2 [] (skipped)',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    2 tests   0 assertions',
    '  Skipped:    3 tests',
    '  Duration:   _ ms',
    ''], '--only "test 3" --only "test 4"');
});

test('cli --skip', async function () {
  let result;

  result = await exec('test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    5 tests   0 assertions',
    '  Duration:   _ ms',
    ''], '--');

  result = await exec('-Tlol', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    5 tests   0 assertions',
    '  Duration:   _ ms',
    ''], '--skip lol');

  result = await exec('--skip=test 1 -', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    4 tests   0 assertions',
    '  Skipped:    1 test',
    '  Duration:   _ ms',
    ''], '--skip "test 1"');

  result = await exec('--skip', 'test 2 []', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] (skipped)',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    4 tests   0 assertions',
    '  Skipped:    1 test',
    '  Duration:   _ ms',
    ''], '--skip "test 2"');

  result = await exec('-Ttest 3 [a]', '-Ttest 4 [b]', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] (skipped)',
    '  4 test 4 [b] (skipped)',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    3 tests   0 assertions',
    '  Skipped:    2 tests',
    '  Duration:   _ ms',
    ''], '--skip "test 3" --skip "test 4"');
});

test('cli --group', async function () {
  let result;

  result = await exec('test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    5 tests   0 assertions',
    '  Duration:   _ ms',
    ''], '--');

  result = await exec('-glol', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '  2 test 2 [] (skipped)',
    '  3 test 3 [a] (skipped)',
    '  4 test 4 [b] (skipped)',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    0 tests   0 assertions',
    '  Skipped:    5 tests',
    '  Duration:   _ ms',
    ''], '--group lol');

  result = await exec('--group=a', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '  2 test 2 [] (skipped)',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] (skipped)',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    2 tests   0 assertions',
    '  Skipped:    3 tests',
    '  Duration:   _ ms',
    ''], '--group a');

  result = await exec('--group', 'b', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '  2 test 2 [] (skipped)',
    '  3 test 3 [a] (skipped)',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    2 tests   0 assertions',
    '  Skipped:    3 tests',
    '  Duration:   _ ms',
    ''], '--group b');

  result = await exec('-ga', '-g', 'b', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - (skipped)',
    '  2 test 2 [] (skipped)',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    3 tests   0 assertions',
    '  Skipped:    2 tests',
    '  Duration:   _ ms',
    ''], '--group a --group b');
});

test('cli --skip-group', async function () {
  let result;

  result = await exec('test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    5 tests   0 assertions',
    '  Duration:   _ ms',
    ''], '--');

  result = await exec('-Glol', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] _ ms',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    5 tests   0 assertions',
    '  Duration:   _ ms',
    ''], '--skip-group lol');

  result = await exec('--skip-group=a', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] (skipped)',
    '',
    '  4 test 4 [b] _ ms',
    '',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    3 tests   0 assertions',
    '  Skipped:    2 tests',
    '  Duration:   _ ms',
    ''], '--skip-group a');

  result = await exec('--skip-group', 'b', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] _ ms',
    '',
    '  4 test 4 [b] (skipped)',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    3 tests   0 assertions',
    '  Skipped:    2 tests',
    '  Duration:   _ ms',
    ''], '--skip-group b');

  result = await exec('-Ga', '-G', 'b', 'test/spawn/cli-run.js');
  this.eq(result.stdout, [
    '',
    '  1 test 1 - _ ms',
    '',
    '  2 test 2 [] _ ms',
    '',
    '  3 test 3 [a] (skipped)',
    '  4 test 4 [b] (skipped)',
    '  5 test 5 [a, b] (skipped)',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      5 tests   0 assertions',
    '  Passing:    2 tests   0 assertions',
    '  Skipped:    3 tests',
    '  Duration:   _ ms',
    ''], '--skip-group a --skip-group b');
});

test('cli --json', async function () {

  await this.test('raw | --json --reporter=json', async function () {
    const original = ['lol', ''];
    const stream = new PassThrough();

    for (const line of original)
      stream.write(line + '\n');
    stream.end();

    const reformat = await exec.json('--json', {stdin: stream});
    this.eq(reformat.stdout, original,
            'reformat raw text to json should return same output');
  });

  await this.test('invalid | --json --reporter=json', async function () {
    const original = ['\x1enot json', ''];
    const stream = new PassThrough();

    for (const line of original)
      stream.write(line + '\n');
    stream.end();

    const reformat = await exec.json('--json', {stdin: stream});
    this.eq(reformat.stdout, original,
            'reformat invalid json to json should return same output');
  });

  const spawn = [
    'test/spawn/console.js',
    'test/spawn/json.js'
  ];

  await this.test('json | --json --reporter=json', async function () {
    const stream = new PassThrough();
    const original = await exec.json(...spawn, {stdout: stream});
    const reformat = await exec.json('--json', {stdin: stream});
    this.eq(reformat.stdout, original.stdout,
            'reformat json to json should return same output');
  });

  await this.test('json | --json --reporter=spec', async function () {
    const original = await exec(...spawn);
    const stream = new PassThrough();
    await exec.json(...spawn, {stdout: stream});
    const reformat = await exec('--json', {stdin: stream});
    this.eq(reformat.stdout, original.stdout,
            'reformat to spec should return same output as running test with ' +
            'spec formatter');
  });
});

test('cli --filename', async function () {
  const result = await exec('--filename', 'test/spawn/test.js');

  this.eq(result.stdout, [
    '',
    '  1 (anonymous) _ ms test/spawn/test.js:5:1',
    '',
    '      1.1 (anonymous) _ ms test/spawn/test.js:6:14',
    '',
    '        ✔ pass',
    '',
    '      1.2 test _ ms test/spawn/test.js:9:14',
    '',
    '        ✔ pass',
    '',
    '      1.3 (anonymous) (skipped) test/spawn/test.js:12:14',
    '      1.4 test (skipped) test/spawn/test.js:15:14',
    '',
    '      1.5 (anonymous) _ ms test/spawn/test.js:18:14',
    '',
    '        ✘ uncaught error test/spawn/test.js:18:14',
    '',
    '          At:       test/spawn/test.js:18:14',
    '          Operator: error',
    '          Actual:   null',
    '',
    '      1.6 test _ ms test/spawn/test.js:22:14',
    '',
    '        ✘ fail test/spawn/test.js:23:10',
    '',
    '          At:       test/spawn/test.js:23:10',
    '          Operator: fail',
    '',
    '  2 (anonymous) _ ms test/spawn/test.js:27:1',
    '',
    '    ✔ test function required',
    '',
    '      2.1 (anonymous) _ ms test/spawn/test.js:40:14',
    '',
    '        ✔ pass',
    '',
    '      2.2 name _ ms test/spawn/test.js:41:14',
    '',
    '        ✔ pass',
    '',
    '      2.3 name _ ms test/spawn/test.js:42:14',
    '',
    '        ✔ pass',
    '',
    '      2.4 (anonymous) _ ms test/spawn/test.js:43:14',
    '',
    '        ✔ pass',
    '',
    '      2.5 (anonymous) _ ms test/spawn/test.js:44:14',
    '',
    '        ✔ pass',
    '',
    '      2.6 name _ ms test/spawn/test.js:45:14',
    '',
    '        ✔ pass',
    '',
    '      2.7 name _ ms test/spawn/test.js:46:14',
    '',
    '        ✔ pass',
    '',
    '      2.8 name _ ms test/spawn/test.js:47:14',
    '',
    '        ✔ pass',
    '',
    '      2.9 name _ ms test/spawn/test.js:48:14',
    '',
    '        ✔ pass',
    '',
    '      2.10 name _ ms test/spawn/test.js:49:14',
    '',
    '        ✔ pass',
    '',
    '      2.11 name _ ms test/spawn/test.js:50:14',
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
    ''], 'spec output');
});

test('cli --summary', async function () {
  const result = await exec('--summary', 'test/spawn/test.js');

  this.eq(result.stdout, [
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
    '  1 (anonymous) _ ms',
    '      1.5 (anonymous) _ ms',
    '        ✘ uncaught error',
    '      1.6 test _ ms',
    '        ✘ fail',
    '',
    '',
    '  Total:      19 tests   16 assertions',
    '  Passing:    14 tests   14 assertions',
    '  Failing:    3 tests   2 assertions',
    '  Skipped:    2 tests',
    '  Duration:   _ ms',
    ''], 'spec output');
});

test('cli --filename --summary', async function () {
  const result = await exec('--filename', '--summary', 'test/spawn/test.js');

  this.eq(result.stdout, [
    '',
    '  1 (anonymous) _ ms test/spawn/test.js:5:1',
    '',
    '      1.1 (anonymous) _ ms test/spawn/test.js:6:14',
    '',
    '        ✔ pass',
    '',
    '      1.2 test _ ms test/spawn/test.js:9:14',
    '',
    '        ✔ pass',
    '',
    '      1.3 (anonymous) (skipped) test/spawn/test.js:12:14',
    '      1.4 test (skipped) test/spawn/test.js:15:14',
    '',
    '      1.5 (anonymous) _ ms test/spawn/test.js:18:14',
    '',
    '        ✘ uncaught error test/spawn/test.js:18:14',
    '',
    '          At:       test/spawn/test.js:18:14',
    '          Operator: error',
    '          Actual:   null',
    '',
    '      1.6 test _ ms test/spawn/test.js:22:14',
    '',
    '        ✘ fail test/spawn/test.js:23:10',
    '',
    '          At:       test/spawn/test.js:23:10',
    '          Operator: fail',
    '',
    '  2 (anonymous) _ ms test/spawn/test.js:27:1',
    '',
    '    ✔ test function required',
    '',
    '      2.1 (anonymous) _ ms test/spawn/test.js:40:14',
    '',
    '        ✔ pass',
    '',
    '      2.2 name _ ms test/spawn/test.js:41:14',
    '',
    '        ✔ pass',
    '',
    '      2.3 name _ ms test/spawn/test.js:42:14',
    '',
    '        ✔ pass',
    '',
    '      2.4 (anonymous) _ ms test/spawn/test.js:43:14',
    '',
    '        ✔ pass',
    '',
    '      2.5 (anonymous) _ ms test/spawn/test.js:44:14',
    '',
    '        ✔ pass',
    '',
    '      2.6 name _ ms test/spawn/test.js:45:14',
    '',
    '        ✔ pass',
    '',
    '      2.7 name _ ms test/spawn/test.js:46:14',
    '',
    '        ✔ pass',
    '',
    '      2.8 name _ ms test/spawn/test.js:47:14',
    '',
    '        ✔ pass',
    '',
    '      2.9 name _ ms test/spawn/test.js:48:14',
    '',
    '        ✔ pass',
    '',
    '      2.10 name _ ms test/spawn/test.js:49:14',
    '',
    '        ✔ pass',
    '',
    '      2.11 name _ ms test/spawn/test.js:50:14',
    '',
    '        ✔ pass',
    '',
    '',
    '  Failed Tests: There was 3 failed tests with 2 failed assertions!',
    '',
    '  1 (anonymous) _ ms test/spawn/test.js:5:1',
    '      1.5 (anonymous) _ ms test/spawn/test.js:18:14',
    '        ✘ uncaught error test/spawn/test.js:18:14',
    '      1.6 test _ ms test/spawn/test.js:22:14',
    '        ✘ fail test/spawn/test.js:23:10',
    '',
    '',
    '  Total:      19 tests   16 assertions',
    '  Passing:    14 tests   14 assertions',
    '  Failing:    3 tests   2 assertions',
    '  Skipped:    2 tests',
    '  Duration:   _ ms',
    ''], 'spec output');
});
