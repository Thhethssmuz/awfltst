'use strict';

const reporters = require('./reporters');
const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

const _tests  = [];
const _before = [];
const _after  = [];

class Harness {

  /**
   * @private
   * @param {Function} Test
   */
  constructor(Test) {
    this.Test = Test;
  }


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
  test(...args) {
    _tests.push(new this.Test(...args));
  }

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
  only(...args) {
    const t = new this.Test(...args);
    t._opts.only = true;
    _tests.push(t);
  }

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
  skip(...args) {
    const t = new this.Test(...args);
    t._opts.skip = true;
    _tests.push(t);
  }


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
   * Create a before hook that will be run before every test.
   *
   * @param {HookOptions} [options]
   * Options object.
   *
   * @param {Function} before
   * Setup function.
   */
  before(...args) {
    const t = new this.Test(...args);
    t._opts.before = true;
    t._opts.after = false;
    _before.push(t);
  }

  /**
   * Create an after hook that will be run after every test.
   *
   * @param {HookOptions} [options]
   * Options object.
   *
   * @param {Function} after
   * Teardown function.
   */
  after(...args) {
    const t = new this.Test(...args);
    t._opts.before = false;
    t._opts.after = true;
    _after.push(t);
  }


  /**
   * @private
   * @param {Object} opts
   * Options object, i.e. cli options.
   *
   * @param {String} [opts.reporter]
   * Reporter to use.
   *
   * @param {Boolean} [opts.color]
   * Whether or not to enable coloured output.
   *
   * @param {Boolean} [opts.console]
   * Whether on not to enable console capture.
   *
   * @param {String[]} [opts.only]
   * List of test names to run exclusively.
   *
   * @param {String[]} [opts.skip]
   * List of test names to skip.
   *
   * @param {String[]} [opts.group]
   * List of test groups to run exclusively.
   *
   * @param {String[]} [opts.skipGroup]
   * List of test groups to skip.
   *
   * @return {Promise<Number>} exitCode
   */
  async run(opts) {
    for (const i of ['only', 'skip', 'group', 'skipGroup'])
      if (!Array.isArray(opts[i]) || !opts[i].length)
        opts[i] = null;

    const reporter = new reporters[opts.reporter || 'spec'](opts);

    let prematureExit = true;
    let instance;

    process.on('exit', (code) => {
      if (!prematureExit)
        return;
      if (code === 0)
        process.exitCode = 1;
      reporter.report(instance._onPrematureExit(true));
      reporter.summary();
    });

    const tests  = _tests.splice(0);
    const before = _before.splice(0);
    const after  = _after.splice(0);

    const parent = {
      inspect: {depth: 10, colors: Boolean(opts.color), sorted: true},
      console: hasOwnProperty(opts, 'console') ? opts.console : true,
      harness: {tests, before, after, _tests , _before, _after}
    };

    const run = {
      only     : tests.some(x => x._opts.only) ? opts.only || [] : opts.only,
      skip     : opts.skip,
      group    : opts.group,
      skipGroup: opts.skipGroup
    };

    for (instance of tests) {
      const result = await instance.run(parent, run);
      reporter.report(result);
    }

    prematureExit = false;
    return reporter.summary();
  }

  /**
   * @private
   */
  static wrap(Test) {
    const harness = new Harness(Test);

    const test  = (...args) => harness.test(...args);
    test.only   = (...args) => harness.only(...args);
    test.skip   = (...args) => harness.skip(...args);
    test.before = (...args) => harness.before(...args);
    test.after  = (...args) => harness.after(...args);
    test.run    = (...args) => harness.run(...args);

    return test;
  }
}

module.exports = Harness;
