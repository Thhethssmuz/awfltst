'use strict';

const test = require('../..');
const {log, error} = console;

test('default', async function () {
  log('line 1');
  error('line 2');
});

test('captured', {console: true}, async function () {
  log('line 3');
  error('line 4');
});

test('not captured', {console: false}, async function () {
  log('line 5');
  error('line 6');
});
