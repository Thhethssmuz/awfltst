'use strict';

const test = require('..');
const exec = require('./exec');
const {version} = require('../package');

test('bin', async function () {
  const result = await exec();
  this.chain('missing file-path')
    .eq(result.stdout, [], 'stdout')
    .eq(result.stderr, ['awfltst: missing <file-path>...'], 'stderr')
    .eq(result.code, 1, 'exit code');
});

test('bin -h', async function () {
  const result = await exec('-h');
  this.chain('should produce help message')
    .eq(result.stdout[0], 'Usage:', 'stdout')
    .eq(result.stderr, [], 'stderr')
    .eq(result.code, 0, 'exit code');
});

test('bin -v', async function () {
  const result = await exec('-v');
  this.chain('should produce version information')
    .eq(result.stdout, [`awfltst v${version}`], 'stdout')
    .eq(result.stderr, [], 'stderr')
    .eq(result.code, 0, 'exit code');
});

test('bin --reporter=invalid', async function () {
  const result = await exec('--reporter=invalid');
  this.chain('invalid reporter')
    .eq(result.stdout, [], 'stdout')
    .eq(result.stderr, ["awfltst: invalid reporter `invalid'"], 'stderr')
    .eq(result.code, 1, 'exit code');
});

test('bin -', async function () {
  const result = await exec('-');
  this.chain('invalid option')
    .eq(result.stdout, [], 'stdout')
    .eq(result.stderr, ["awfltst: invalid option `-'"], 'stderr')
    .eq(result.code, 1, 'exit code');
});

test('bin --does-not-exist', async function () {
  const result = await exec('--does-not-exist');
  this.chain('invalid option')
    .eq(result.stdout, [], 'stdout')
    .eq(result.stderr, ["awfltst: invalid option `--does-not-exist'"], 'stderr')
    .eq(result.code, 1, 'exit code');
});

test('bin -- --does-not-exist', async function () {
  const result = await exec('--', '--does-not-exist');
  this.chain('file not found')
    .eq(result.stdout, [], 'stdout')
    .match(result.stderr.join('\n'), /Cannot find module/, 'stderr')
    .eq(result.code, 1, 'exit code');
});

test('bin --color', async function () {
  const result = await exec('--color', 'test/spawn/test.js');
  // eslint-disable-next-line no-control-regex
  this.match(
    result.stdout.join('\n'),
    /\x1b\[\d+(;\d+)?m/,
    'should contain ANSI escape codes'
  );
});

test('bin --no-color', async function () {
  const result = await exec('--no-color', 'test/spawn/test.js');
  // eslint-disable-next-line no-control-regex
  this.notMatch(
    result.stdout.join('\n'),
    /\x1b\[\d+(;\d+)?m/,
    'should not contain ANSI escape codes'
  );
});
