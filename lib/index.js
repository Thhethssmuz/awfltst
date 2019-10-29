'use strict';

const Test = require('./test');
const reporters = require('./reporters');
const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

const _tests  = [];
const _before = [];
const _after  = [];

/**
 * Test options.
 *
 * @typedef {Object} TestOptions
 * @property {Boolean} [skip]
 * Whether or not to skip this test.
 *
 * @property {Boolean} [only]
 * Whether or not to run only this test.
 *
 * @property {Boolean} [console=true]
 * Whether or not to capture console output.
 *
 * @property {String|String[]} [group]
 * The group(s) this test belongs to.
 *
 * @property {Object} [inspect]
 * Options passed to `util.inspect` when reporting errors.
 */

/**
 * Hook options.
 *
 * @typedef {Object} HookOptions
 * @property {Boolean} [once]
 * Whether or not this hook should be run only once.
 *
 * @property {String|String[]} [group]
 * The group(s) this hook will be limited to.
 *
 * @property {String|String[]} [skipGroup]
 * The group(s) this hook will ignore.
 */

/**
 * Create a new Test.
 *
 * @function
 * @global
 *
 * @param {String} [name]
 * The name of this test.
 *
 * @param {TestOptions} [options]
 * Options object.
 *
 * @param {Function} test
 * Test function.
 */
const test = function (...args) {
  _tests.push(new Test(...args));
};

/**
 * Shorthand for creating a test with `option.only = true`.
 *
 * @param {String} [name]
 * The name of this test.
 *
 * @param {TestOptions} [options]
 * Options object.
 *
 * @param {Function} test
 * Test function.
 */
test.only = function (...args) {
  const t = new Test(...args);
  t._opts.only = true;
  _tests.push(t);
};

/**
 * Shorthand for creating a test with `option.skip = true`.
 *
 * @param {String} [name]
 * The name of this test.
 *
 * @param {TestOptions} [options]
 * Options object.
 *
 * @param {Function} test
 * Test function.
 */
test.skip = function (...args) {
  const t = new Test(...args);
  t._opts.skip = true;
  _tests.push(t);
};

/**
 * Create a before hook that will be run before every test.
 *
 * @param {HookOptions} [options]
 * Options object.
 *
 * @param {Function} before
 * Setup function.
 */
test.before = function (...args) {
  const t = new Test(...args);
  t._opts.before = true;
  t._opts.after = false;
  _before.push(t);
};

/**
 * Create an after hook that will be run after every test.
 *
 * @param {HookOptions} [options]
 * Options object.
 *
 * @param {Function} after
 * Teardown function.
 */
test.after = function (...args) {
  const t = new Test(...args);
  t._opts.before = false;
  t._opts.after = true;
  _after.push(t);
};

/**
 * @private
 * @param {Object} opts
 * @return {Promise<Number>} exitCode
 */
test.run = async function (opts) {

  const tests  = _tests.splice(0);
  const before = _before.splice(0);
  const after  = _after.splice(0);

  const reporter = new reporters[opts.reporter || 'spec'](opts);

  const parent = {
    inspect: {depth: 10, colors: opts.color, sorted: true},
    console: hasOwnProperty(opts, 'console') ? opts.console : true,
    harness: {tests, before, after, _tests, _before, _after}
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
