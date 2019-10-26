'use strict';

const test = require('..');
const exec = require('./exec');


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
