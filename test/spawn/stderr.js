'use strict';

const test = require('../..');
const {log, error} = console;

test('not captured', {console: false}, async function () {
  error('line 1');
  error('line 2');

  this.plan(2);
  await this.throws(() => {
    this.eq(this.stderr, '', 'empty');
  }, /console output is not captured/, 'not captured, throws');

  await this.throws(() => {
    this.stderr = '';
  }, /console output is not captured/, 'clear, not captured, throws');

  error('line 3');
});

test('captured', {console: true}, async function () {
  log('line 4');
  error('line 5');
  log('line 6');
  error('line 7');

  this.eq(this.stderr, 'line 5\nline 7\n', 'captured');
  this.stderr = '';
  this.eq(this.stderr, '', 'cleared');

  log('line 8');
  error('line 9');
});
