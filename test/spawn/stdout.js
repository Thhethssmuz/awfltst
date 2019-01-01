'use strict';

const test = require('../..');
const {log} = console;

test('not captured', {console: false}, async function () {
  log('line 1');
  log('line 2');

  this.plan(2);
  await this.throws(() => {
    this.eq(this.stdout, '', 'empty');
  }, /console output is not captured/, 'not captured, throws');

  await this.throws(() => {
    this.stdout = '';
  }, /console output is not captured/, 'clear, not captured, throws');

  log('line 3');
});

test('captured', {console: true}, async function () {
  log('line 4');
  log('line 5');

  this.eq(this.stdout, 'line 4\nline 5\n', 'captured');
  this.stdout = '';
  this.eq(this.stdout, '', 'cleared');

  log('line 6');
});
