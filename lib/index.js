'use strict';

const Test = require('./test');
const reporters = require('./reporters');
const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

const _tests  = [];
const _before = [];
const _after  = [];

const test = function (...args) {
  _tests.push(new Test(...args));
};

test.before = function (...args) {
  _before.push(new Test(...args));
};

test.after = function (...args) {
  _after.push(new Test(...args));
};

test.only = function (...args) {
  const t = new Test(...args);
  t._opts.only = true;
  _tests.push(t);
};

test.skip = function (...args) {
  const t = new Test(...args);
  t._opts.skip = true;
  _tests.push(t);
};


test.run = async function (opts) {

  const tests  = _tests.splice(0);
  const before = _before.splice(0);
  const after  = _after.splice(0);

  const reporter = new reporters[opts.reporter || 'spec'](opts);

  const parent = {
    inspect: {depth: 10, colors: opts.color, sorted: true},
    console: hasOwnProperty(opts, 'console') ? opts.console : true,
    harness: {before, after, _tests, _before, _after}
  };

  const run = {
    only     : tests.some(x => x._opts.only) ? opts.only || [] : opts.only,
    skip     : opts.skip,
    group    : opts.group,
    skipGroup: opts.skipGroup
  };

  for (const instance of tests) {
    const result = await instance.run(parent, run);
    reporter.report(result);
  }

  return reporter.summary();
};

module.exports = test;
