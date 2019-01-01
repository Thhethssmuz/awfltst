'use strict';

const Test = require('./test');
const reporters = require('./reporters');

const tests = [];
const test = function (...args) {
  tests.push(new Test(...args));
};

test.run = async function (opts) {

  const reporter = new reporters[opts.reporter || 'spec'](opts);

  const parent = {
    inspect: {depth: 10, colors: opts.color, sorted: true}
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
