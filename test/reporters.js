'use strict';

const wrap = x => `\x1e${x}\n`;
const test = require('..');
const reporters = require('../lib/reporters');

const results = [{
  ok      : true,
  duration: 0,
  operator: 'test',
  name    : 'first',
  results : [{
    key  : 'assertion',
    value: {ok: true, operator: 'pass', name: 'pass'}
  }]
}, {
  ok      : false,
  duration: 3600000,
  operator: 'test',
  name    : 'second',
  results : [{
    key  : 'stdout',
    value: 'line 1'
  }, {
    key  : 'stderr',
    value: 'line 2'
  }, {
    key  : 'assertion',
    value: {
      ok      : true,
      duration: 300000,
      operator: 'eq',
      expected: '1',
      actual  : '1',
      name    : 'successful assertion'
    }
  }, {
    key  : 'assertion',
    value: {
      ok      : false,
      expected: '1',
      actual  : '2',
      name    : 'failed assertion'
    }
  }, {
    key  : 'assertion',
    value: {
      ok      : false,
      expected: '{ a: 1,\n  b: 2 }',
      actual  : '{ a: 1,\n  b: 3 }',
      name    : 'failed long assertion'
    }
  }, {
    key  : 'assertion',
    value: {
      ok      : false,
      at      : './some/file.js (0:0)',
      diffable: true,
      expected: '[ 1,\n  2 ]',
      actual  : '[ 1,\n  3 ]',
      name    : 'failed diffable assertion'
    }
  }, {
    key  : 'test',
    value: {
      ok      : true,
      operator: 'chain',
      name    : 'successful chain assertion',
      results : [
        {key: 'assertion', value: {ok: true, operator: 'pass', name: 'pass'}},
        {key: 'assertion', value: {ok: true, operator: 'pass', name: 'pass'}}
      ]
    }
  }, {
    key  : 'test',
    value: {
      ok      : false,
      operator: 'chain',
      name    : 'failed chain assertion',
      results : [
        {key: 'assertion', value: {ok: true, operator: 'pass', name: 'pass'}},
        {key: 'assertion', value: {ok: false, operator: 'fail', name: 'fail'}},
        {key: 'assertion', value: {ok: 'skipped', name: 'next'}}
      ]
    }
  }, {
    key  : 'test',
    value: {
      ok      : true,
      operator: 'test',
      name    : 'successful sub-test',
      duration: 10,
      results : [
        {key: 'assertion', value: {ok: true, operator: 'pass', name: 'pass'}}
      ]
    }
  }, {
    key  : 'test',
    value: {
      ok      : 'skipped',
      operator: 'test',
      name    : 'skipped sub-test'
    }
  }, {
    key  : 'test',
    value: {
      ok      : false,
      operator: 'test',
      name    : 'failed sub-test',
      duration: 5000,
      results : [
        {key: 'assertion', value: {ok: true, operator: 'pass', name: 'pass'}},
        {key: 'assertion', value: {ok: false, operator: 'fail', name: 'fail'}},
        {key: 'assertion', value: {ok: 'skipped', name: 'next'}}
      ]
    }
  }]
}];


test('reporters.json', async function () {
  // eslint-disable-next-line new-cap
  const reporter = new reporters.json();

  reporter.report(results[0]);
  reporter.summary();

  this.eq(this.stdout, wrap(JSON.stringify(results[0])), 'successful test');

  this.stdout = '';
  reporter.report(results[1]);
  reporter.summary();

  this.eq(this.stdout, wrap(JSON.stringify(results[1])), 'failed test');

  this.stdout = '';
});

test('reporters.spec', async function () {
  // eslint-disable-next-line new-cap
  const reporter = new reporters.spec();

  reporter.report(results[0]);
  reporter.summary();

  this.eq(this.stdout.split('\n'), [
    '',
    '  1 first 0 ms',
    '',
    '    ✔ pass',
    '',
    '',
    '  All tests passed!',
    '',
    '',
    '  Total:      1 test    1 assertion',
    '  Passing:    1 test    1 assertion',
    '  Duration:   0 ms',
    '',
    ''], 'successful test');

  this.stdout = '';
  reporter.report(results[1]);
  reporter.summary();

  this.eq(this.stdout.split('\n'), [
    '',
    '  2 second 1 h',
    '',
    '    line 1',
    '',
    '    ✔ successful assertion 5 m',
    '',
    '    ✘ failed assertion',
    '',
    '      Expected: 1',
    '      Actual:   2',
    '',
    '    ✘ failed long assertion',
    '',
    '      Expected:',
    '        { a: 1,',
    '          b: 2 }',
    '      Actual:',
    '        { a: 1,',
    '          b: 3 }',
    '',
    '    ✘ failed diffable assertion',
    '',
    '      At:       ./some/file.js (0:0)',
    '      Expected: -',
    '      Actual:   +',
    '          [ 1,',
    '        -   2 ]',
    '        +   3 ]',
    '',
    '    ✔ successful chain assertion',
    '      ✔ pass',
    '      ✔ pass',
    '',
    '    ✘ failed chain assertion',
    '',
    '      ✔ pass',
    '',
    '      ✘ fail',
    '',
    '        Operator: fail',
    '',
    '      2.1 successful sub-test 10 ms',
    '',
    '        ✔ pass',
    '',
    '      2.2 skipped sub-test (skipped)',
    '',
    '      2.3 failed sub-test 5 s',
    '',
    '        ✔ pass',
    '',
    '        ✘ fail',
    '',
    '          Operator: fail',
    '',
    '',
    '  Failed Tests: There was 2 failed tests with 5 failed assertions!',
    '',
    '',
    '  Total:      5 tests   14 assertions',
    '  Passing:    2 tests    7 assertions',
    '  Failing:    2 tests    5 assertions',
    '  Skipped:    1 test     2 assertions',
    '  Duration:   1 h',
    '',
    ''], 'failed test');

  this.stdout = '';
  this.stderr = '';
});
