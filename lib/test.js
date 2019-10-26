'use strict';

const op = require('./operators');
const cwd = process.cwd();
const {inspect} = require('util');
const {Writable} = require('stream');
const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

const trace = function (err) {
  const oldLimit = Error.stackTraceLimit;
  const oldHandler = Error.prepareStackTrace;

  let at;

  Error.stackTraceLimit = Infinity;
  Error.prepareStackTrace = (error, structuredStackTrace) => {
    for (const callsite of structuredStackTrace) {
      const file = callsite.getFileName();
      if (file.indexOf(__dirname) === 0)
        continue;

      at = file.replace(cwd + '/', './');

      const line = callsite.getLineNumber();
      const column = callsite.getColumnNumber();
      /* istanbul ignore else */
      if (typeof line === 'number') {
        at += ' (' + line;
        /* istanbul ignore else */
        if (typeof column === 'number')
          at += ':' + column;
        at += ')';
      }

      break;
    }
    return structuredStackTrace;
  };

  // eslint-disable-next-line no-unused-expressions
  (err || new Error()).stack;

  Error.prepareStackTrace = oldHandler;
  Error.stackTraceLimit = oldLimit;

  return at;
};

const createWritableStream = function (buffer, key) {
  const stream = new Writable({
    write(chunk, encoding, callback) {
      const previous = buffer[buffer.length - 1];
      if (previous && previous.key === key)
        previous.value += chunk.toString();
      else
        buffer.push({key, value: chunk.toString()});
      callback();
    }
  });
  return stream;
};

const transferHarnessTests = function (harness) {
  for (const instance of harness._tests.splice(0))
    harness.tests.push(instance);
  for (const instance of harness._before.splice(0))
    harness.before.push(instance);
  for (const instance of harness._after.splice(0))
    harness.after.push(instance);
};

const matchRunParameters = function (test, run) {

  if (test._opts.skip)
    return false;

  if (run.skip && op.contains(run.skip, test._name))
    return false;

  if (run.only && !test._opts.only && op.notContains(run.only, test._name))
    return false;

  if (run.group && run.group.every(g => op.notContains(test._opts.group, g)))
    return false;

  if (run.skipGroup &&
      run.skipGroup.some(g => op.contains(test._opts.group, g)))
    return false;

  return true;
};

const countResults = (count, result) => {
  if (result.key === 'chain')
    return result.value.results.reduce(countResults, count);
  if (result.key === 'test' || result.key === 'assertion')
    return count + 1;
  return count;
};

/**
 * Test scope inside `test` function.
 *
 * This object is also passed as the first and only argument to the `test`
 * function fore those that favours arrow functions.
 *
 * @namespace this
 * @inner
 */

class Test {

  /**
   * Create a new Test.
   *
   * @name test
   * @function
   * @global
   *
   * @param {String} [name]
   * The name of this test.
   *
   * @param {Object} [options]
   * Options object.
   *
   * @param {Boolean} [options.skip]
   * Whether or not to skip this test.
   *
   * @param {Boolean} [options.only]
   * Whether or not to run only this test.
   *
   * @param {Boolean} [options.console=true]
   * Whether or not to capture console output.
   *
   * @param {String|String[]} [options.group]
   * The group(s) this test belongs to.
   *
   * @param {Object} [options.inspect]
   * Options passed to `util.inspect` when reporting errors.
   *
   * @param {Function} test
   * Test function.
   */
  constructor(...args) {
    this._name = args.find(x => typeof x === 'string') || '(anonymous)';
    this._opts = args.find(x => typeof x === 'object') || {};
    this._test = args.find(x => typeof x === 'function');

    if (!this._test)
      throw new TypeError('Missing test function');

    for (const prop of ['group', 'skipGroup'])
      if (hasOwnProperty(this._opts, prop) && !Array.isArray(this._opts[prop]))
        this._opts[prop] = [this._opts[prop]];

    this._at      = trace();
    this._results = Object.assign([], {ok: true});
    this._plan    = null;
  }

  /**
   * Run a test.
   *
   * @private
   * @name this.run
   * @memberOf this
   *
   * @param {Object} parent
   * Parent test options.
   *
   * @param {Object} run
   * Run options passed on command line.
   *
   * @return {Object}
   */
  async run(parent, run) {
    this._opts.harness =
      Object.assign({}, parent.harness, {tests: [], before: [], after: []});
    for (const prop of ['console', 'inspect'])
      if (!hasOwnProperty(this._opts, prop))
        this._opts[prop] = parent[prop];
    if (this._opts.only)
      run.only = run.only || [];

    if (!matchRunParameters(this, run)) {
      return {
        ok      : 'skipped',
        operator: 'test',
        results : this._results,
        name    : this._name,
        at      : this._at,
        duration: 0
      };
    }

    let originalStdStreams;
    if (this._opts.console) {
      originalStdStreams = {
        stdout: process.stdout.write,
        stderr: process.stderr.write
      };

      const newStdoutStream = createWritableStream(this._results, 'stdout');
      const newStderrStream = createWritableStream(this._results, 'stderr');

      process.stdout.write = newStdoutStream.write.bind(newStdoutStream);
      process.stderr.write = newStderrStream.write.bind(newStderrStream);
    }

    let testError;
    let testErrorAt = this._at;
    const t0 = Date.now();
    try {

      this._run = {};
      transferHarnessTests(parent.harness);

      for (const instance of parent.harness.before) {
        if (matchRunParameters(this, instance._opts)) {
          testErrorAt = instance._at;
          await instance._test.call(this, this);
          transferHarnessTests(this._opts.harness);
        }
      }

      testErrorAt = this._at;
      await this._test(this);
      transferHarnessTests(this._opts.harness);

      if (this._opts.harness.tests.some(x => x._opts.only))
        this._run.only = this._run.only || [];

      for (const test of this._opts.harness.tests) {
        const value = await test.run(this._opts, this._run);
        this._results.push({key: 'test', value});
        this._results.ok = Boolean(this._results.ok) && Boolean(value.ok);
        transferHarnessTests(this._opts.harness);
      }

      for (const instance of parent.harness.after) {
        if (matchRunParameters(this, instance._opts)) {
          testErrorAt = instance._at;
          await instance._test.call(this, this);
          transferHarnessTests(this._opts.harness);
        }
      }

      testErrorAt = this._at;

    } catch (err) {
      // wrap in object case of silly things like throwing falsy values
      testError = {err};
    }
    const duration = Date.now() - t0;

    if (this._opts.console) {
      /* eslint-disable require-atomic-updates */
      process.stdout.write = originalStdStreams.stdout;
      process.stderr.write = originalStdStreams.stderr;
      /* eslint-enable require-atomic-updates */
    }

    if (testError) {
      const expected = undefined;
      this.compare(op.error, testError.err, expected, 'uncaught error', {
        expected, at: testErrorAt
      });
    }

    const hasErrorOutput = this._results.some(x =>
      x.key === 'stderr' && x.value.length);
    if (hasErrorOutput) {
      this.compare(op.eq, this.stderr, '', 'unexpected output to stderr',
                   {operator: 'stderr', at: this._at});
    }

    const count = this._results.reduce(countResults, 0);

    if (this._plan && count !== this._plan.expected) {
      const plan = this._plan;
      this.compare(op.eq, count, plan.expected, plan.name,
                   {operator: 'plan', at: this._plan.at});
    }

    const ok = !testError && this._results.ok;
    return {ok, duration,
      operator: 'test',
      results : this._results,
      name    : this._name,
      at      : this._at
    };
  }

  /**
   * Getter for console output written to stdout during the test up until this
   * point.
   *
   * @name this.stdout
   * @memberOf this
   *
   * @return {String}
   */
  get stdout() {
    if (!this._opts.console)
      throw new Error('cannot get stdout when console output is not captured');
    return this._results
      .filter(x => x.key === 'stdout')
      .map(x => x.value).join('');
  }

  /**
   * Setter for console output written to stdout during the test.
   *
   * @name this.stdout
   * @memberOf this
   *
   * @param {String} value
   */
  set stdout(value) {
    if (!this._opts.console)
      throw new Error('cannot set stdout when console output is not captured');
    for (const result of this._results)
      if (result.key === 'stdout')
        result.value = '';
    this._results.push({key: 'stdout', value: String(value)});
  }

  /**
   * Getter for console output written to stderr during the test up until this
   * point.
   *
   * @name this.stderr
   * @memberOf this
   *
   * @return {String}
   */
  get stderr() {
    if (!this._opts.console)
      throw new Error('cannot get stderr when console output is not captured');
    return this._results
      .filter(x => x.key === 'stderr')
      .map(x => x.value).join('');
  }

  /**
   * Setter for console output written to stderr during the test.
   *
   * @name this.stderr
   * @memberOf this
   *
   * @param {String} value
   */
  set stderr(value) {
    if (!this._opts.console)
      throw new Error('cannot set stderr when console output is not captured');
    for (const result of this._results)
      if (result.key === 'stderr')
        result.value = '';
    this._results.push({key: 'stderr', value: String(value)});
  }

  /**
   * Set the number of assertions planned for this test.
   *
   * @name this.plan
   * @memberOf this
   *
   * @param {Number} expected
   * @param {String} [name]
   * @return {Test} this
   */
  plan(expected, name = 'number of assertions != plan') {
    this._plan = {expected, name, at: trace()};
    return this;
  }

  /**
   * Compare using a custom comparator function.
   *
   * **Aliases**: `compareWith`.
   *
   * @name this.compare
   * @memberOf this
   *
   * @param {Function} comparator
   * The comparator function to use for the assertion. The function is passed
   * the `actual` and `expected` values as is.
   *
   * @param {*} actual
   * The actual value to be compared.
   *
   * @param {*} expected
   * The expected value to be compared against.
   *
   * @param {String} [name]
   * A name identifying this assertion.
   *
   * @param {Object} [options]
   * Additional options.
   *
   * @param {String} [options.operator]
   * Override the operator value for the test output. Defaults to the name of
   * the comparator function or simply 'compare' if `comparator` has no name.
   *
   * @param {String} [options.expected]
   * Override the expected value in the test output. Defaults to inspecting the
   * value of `expected` using `util.inspect`.
   *
   * @param {String} [options.actual]
   * Override the actual value in the test output. Defaults to inspecting the
   * value of `actual` using `util.inspect`.
   *
   * @param {Boolean} [options.diffable]
   * Determine whether or not the actual and expected test output values are
   * diffed in the test output. Default to false.
   *
   * @param {String} [options.at]
   * Override the trace-line in the test output.
   *
   * @returns {Test} this
   */
  compare(comparator, actual, expected, name, options = {}) {
    if (typeof comparator !== 'function')
      throw new TypeError('comparator must be a function');
    if (arguments.length < 3)
      throw new TypeError('both actual and expected must be specified');
    if (typeof name === 'object') {
      options = name; // eslint-disable-line no-param-reassign
      name = ''; // eslint-disable-line no-param-reassign
    }

    const ok = Boolean(comparator(actual, expected));
    const operator = options.operator || comparator.name || 'compare';
    const result = {ok, operator, name: name || operator};
    if (!ok) {
      result.expected = hasOwnProperty(options, 'expected') ?
        options.expected :
        inspect(expected, this._opts.inspect);
      result.actual = hasOwnProperty(options, 'actual') ?
        options.actual :
        inspect(actual, this._opts.inspect);
      result.diffable = options.diffable || false;
      result.at = options.at || trace();
    }

    this._results.push({key: 'assertion', value: result});
    this._results.ok = Boolean(this._results.ok) && ok;
    return this;
  }

  /**
   * Create a "chain test", a special form of sub-test created purely through
   * chaining calls on the returned Test instance.
   *
   * @name this.chain
   * @memberOf this
   *
   * @param {String} [name]
   * @return {Test} this, ish...
   */
  chain(name) {
    const chainResult = {
      key  : 'chain',
      value: {
        ok      : true,
        operator: 'chain',
        results : [],
        name    : name || 'chain',
        at      : trace()
      }
    };

    const chain = Object.create(this);
    chain._chain = this;
    chain._results = Object.defineProperty(chainResult.value.results, 'ok', {
      get: () => chainResult.value.ok,
      set: ok => {
        chainResult.value.ok = ok;
        this._results.ok = Boolean(this._results.ok) && ok;
      }
    });

    this._results.push(chainResult);
    return chain;
  }

  /**
   * Return to the parent of this chain. Useful in nested chain tests.
   *
   * @name this.unchain
   * @memberOf this
   *
   * @return {Test} The chain's parent, or this if this is not a chain test.
   */
  unchain() {
    return this._chain || this;
  }

  /**
   * Assertion that automatically fails.
   *
   * @name this.fail
   * @memberOf this
   *
   * @param {String} [name]
   * @return {Test} this
   */
  fail(name) {
    const actual = undefined;
    const expected = undefined;
    return this.compare(op.fail, actual, expected, name, {actual, expected});
  }

  /**
   * Assertion that automatically succeeds.
   *
   * @name this.pass
   * @memberOf this
   *
   * @param {String} [name]
   * @return {Test} this
   */
  pass(name) {
    const actual = undefined;
    const expected = undefined;
    return this.compare(op.pass, actual, expected, name, {actual, expected});
  }

  /**
   * Assertion that automatically fails with the given error.
   *
   * @name this.error
   * @memberOf this
   *
   * @param {*} error
   * @param {String} [name]
   * @return {Test} this
   */
  error(error, name) {
    const expected = undefined;
    return this.compare(op.error, error, expected, name, {expected});
  }

  /**
   * Assert a "truthy" value.
   *
   * **Aliases**: `true`.
   *
   * @name this.ok
   * @memberOf this
   *
   * @param {*} actual
   * @param {String} [name]
   * @return {Test} this
   */
  ok(actual, name) {
    return this.compare(op.ok, actual, true, name);
  }

  /**
   * Assert a "falsy" value. Inverse of `ok`.
   *
   * **Aliases**: `false`, `notOk`, `notok`.
   *
   * @name this.not
   * @memberOf this
   *
   * @param {*} actual
   * @param {String} [name]
   * @return {Test} this
   */
  not(actual, name) {
    return this.compare(op.not, actual, false, name);
  }

  /**
   * Assert deep equality.
   *
   * **Aliases**: `deepStrictEquals`, `deepStrictEqual`, `deepEquals`,
   *   `deepEqual`, `equals`, `equal`, `is`.
   *
   * @name this.eq
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  eq(actual, expected, name) {
    const name_ = name || `equals ${inspect(expected, {depth: -1})}`;
    const diffable = this._opts.inspect.sorted;
    return this.compare(op.eq, actual, expected, name_, {diffable});
  }

  /**
   * Assert deep inequality. Inverse of `eq`.
   *
   * **Aliases**: `notDeepStrictEquals`, `notDeepStrictEqual`, `notDeepEquals`,
   *   `notDeepEqual`, `isNotEqual`, `notEquals`, `notEqual`, `isNot`, `neq`.
   *
   * @name this.ne
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  ne(actual, expected, name) {
    const name_ = name || `not equals ${inspect(expected, {depth: -1})}`;
    return this.compare(op.ne, actual, expected, name_);
  }

  /**
   * Assert that `actual` is greater than `expected`.
   *
   * **Aliases**: `greaterThan`, `greater`.
   *
   * @name this.gt
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  gt(actual, expected, name) {
    const name_ = name || `greater than ${inspect(expected, {depth: -1})}`;
    return this.compare(op.gt, actual, expected, name_);
  }

  /**
   * Assert that `actual` is greater than or equal to `expected`.
   *
   * **Aliases**: `greaterThanOrEquals`, `greaterThanOrEqual`,
   *   `greaterOrEquals`, `greaterOrEqual`, `ge`.
   *
   * @name this.gte
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  gte(actual, expected, name) {
    const name_ = name ||
      `greater than or equal to ${inspect(expected, {depth: -1})}`;
    return this.compare(op.gte, actual, expected, name_);
  }

  /**
   * Assert that `actual` is less than or equal to `expected`.
   *
   * **Aliases**: `lessThanOrEquals`, `lessThanOrEqual`, `lessOrEquals`,
   *   `lessOrEqual`, `le`.
   *
   * @name this.lte
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  lte(actual, expected, name) {
    const name_  = name ||
      `less than or equal to ${inspect(expected, {depth: -1})}`;
    return this.compare(op.lte, actual, expected, name_);
  }

  /**
   * Assert that `actual` is less than `expected`.
   *
   * **Aliases**: `lessThan`,  `less`.
   *
   * @name this.lt
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  lt(actual, expected, name) {
    const name_ = name || `less than ${inspect(expected, {depth: -1})}`;
    return this.compare(op.lt, actual, expected, name_);
  }

  /**
   * Assert that `actual` is within the given range.
   *
   * @name this.between
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} min
   * @param {*} max
   * @param {String} [name]
   * @return {Test} this
   */
  between(actual, min, max, name) {
    const name_ = name ||
      `between ${inspect(min, {depth: -1})} and ${inspect(max, {depth: -1})}`;
    return this.compare(op.between, actual, [min, max], name_);
  }

  /**
   * Assert that `actual` is not within the given range. Inverse of `between`.
   *
   * @name this.notBetween
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} min
   * @param {*} max
   * @param {String} [name]
   * @return {Test} this
   */
  notBetween(actual, min, max, name) {
    const name_ = name || 'not between ' +
      `${inspect(min, {depth: -1})} and ${inspect(max, {depth: -1})}`;
    return this.compare(op.notBetween, actual, [min, max], name_);
  }

  /**
   * Assert that `actual` is equal to `expected` with a variance threshold of
   * ± `variance`.
   *
   * **Aliases**: `approximately`.
   *
   * @name this.approx
   * @memberOf this
   *
   * @param {Number} actual
   * @param {Number} expected
   * @param {Number} variance
   * @param {String} [name]
   * @return {Test} this
   */
  approx(actual, expected, variance, name) {
    const expected_ = inspect(expected, this._opts.inspect) + ' ± ' +
                      inspect(variance, this._opts.inspect);
    const name_ = name || 'approximately equals ' +
      inspect(expected, {depth: -1}) + ' ± ' +
      inspect(variance, {depth: -1});
    return this.compare(op.approx, actual, [expected, variance], name_, {
      expected: expected_
    });
  }

  /**
   * Assert that `actual` contains `expected`.
   *
   * @name this.contains
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  contains(actual, expected, name) {
    const name_ = name || `contains ${inspect(expected, {depth: -1})}`;
    return this.compare(op.contains, actual, expected, name_);
  }

  /**
   * Assert that `actual` does not contain `expected`. Inverse of `contains`.
   *
   * @name this.notContains
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  notContains(actual, expected, name) {
    const name_ = name || `does not contain ${inspect(expected, {depth: -1})}`;
    return this.compare(op.notContains, actual, expected, name_);
  }

  /**
   * Assert that `actual` is in `expected`. Reversed order version of
   * `contains`.
   *
   * @name this.in
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  in(actual, expected, name) {
    const name_ = name ||
      `in ${inspect(expected, {depth: 0, maxArrayLength: 3})}`;
    return this.compare(op.in, actual, expected, name_);
  }

  /**
   * Assert that `actual` is not in `expected`. Inverse of `in`.
   *
   * @name this.notIn
   * @memberOf this
   *
   * @param {*} actual
   * @param {*} expected
   * @param {String} [name]
   * @return {Test} this
   */
  notIn(actual, expected, name) {
    const name_ = name ||
      `not in ${inspect(expected, {depth: 0, maxArrayLength: 3})}`;
    return this.compare(op.notIn, actual, expected, name_);
  }

  /**
   * Assert that `actual` has a type of `expected` or is an instance of
   * `expected`.
   *
   * **Aliases**: `instanceOf`, `instanceof`, `instance`, `typeOf`, `typeof`.
   *
   * @name this.type
   * @memberOf this
   *
   * @param {*} actual
   * @param {String|Function} expected
   * @param {String} [name]
   * @return {Test} this
   */
  type(actual, expected, name) {
    if (typeof expected === 'string') {
      const name_ = name || `is type of '${expected}'`;
      return this.compare(op.type, actual, expected, name_);
    }

    if (typeof expected === 'function') {
      const name_ = name || `is instance of ${expected.name || 'anonymous'}`;
      return this.compare(op.instance, actual, expected, name_);
    }

    throw TypeError('invalid type');
  }

  /**
   * Assert that `actual` matches the given regular expression `expected`.
   *
   * @name this.match
   * @memberOf this
   *
   * @param {String} actual
   * @param {RegExp} expected
   * @param {String} [name]
   * @return {Test} this
   */
  match(actual, expected, name) {
    const name_ = name || `matches ${inspect(expected, {depth: -1})}`;
    return this.compare(op.match, actual, expected, name_);
  }

  /**
   * Assert that `actual` does not match the given regular expression
   * `expected`. Inverse of `match`.
   *
   * @name this.notMatch
   * @memberOf this
   *
   * @param {String} actual
   * @param {RegExp} expected
   * @param {String} [name]
   * @return {Test} this
   */
  notMatch(actual, expected, name) {
    const name_ = name || `does not match ${inspect(expected, {depth: -1})}`;
    return this.compare(op.notMatch, actual, expected, name_);
  }

  /**
   * Create a sub-test.
   *
   * **Aliases**: `subTest`, `subtest`.
   *
   * @name this.test
   * @memberOf this
   *
   * @param {String} [name]
   * @param {Object} [options]
   * @param {Function} test
   */
  async test(...args) {
    const value = await new Test(...args).run(this._opts, this._run);
    this._results.push({key: 'test', value});
    this._results.ok = Boolean(this._results.ok) && Boolean(value.ok);
  }

  /**
   * Assert that the given test-function throws.
   *
   * @name this.throws
   * @memberOf this
   *
   * @param {Function|Promise} test
   * @param {RegExp|Function} [expected]
   * @param {String} [name]
   */
  async throws(test, expected, name) {
    if (typeof expected === 'string') {
      const tmp = name;
      name = expected; // eslint-disable-line no-param-reassign
      expected = tmp; // eslint-disable-line no-param-reassign
    }

    const opts = {operator: 'throws', at: trace()};
    const name_ = name ||
      `throws${expected ? ' ' + inspect(expected, {depth: -1}) : ''}`;

    try {
      await (typeof test === 'function' ? test() : test);
      return this.compare(op.fail, undefined, expected, name_, opts);
    } catch (actual) {

      if (typeof expected === 'function')
        return this.compare(op.instance, actual, expected, name_, opts);

      if (expected instanceof RegExp)
        return this.compare(op._match, actual, expected, name_, opts);

      return this.compare(op.pass, actual, expected, name_, opts);
    }
  }

  /**
   * Assert that the given test-function does not throw.
   *
   * @name this.notThrows
   * @memberOf this
   *
   * @param {Function|Promise} test
   * @param {String} [name]
   */
  async notThrows(test, name) {
    const name_ = name || 'does not throw';
    const opts = {operator: 'notThrows', at: trace()};
    try {
      await (typeof test === 'function' ? test() : test);
      return this.compare(op.pass, undefined, undefined, name_, opts);
    } catch (actual) {
      return this.compare(op.fail, actual, undefined, name_, opts);
    }
  }
}

// aliases
Test.prototype.compareWith =
Test.prototype.compare;

Test.prototype.true =
Test.prototype.ok;

Test.prototype.false =
Test.prototype.notOk =
Test.prototype.notok =
Test.prototype.not;

Test.prototype.deepStrictEquals =
Test.prototype.deepStrictEqual =
Test.prototype.deepEquals =
Test.prototype.deepEqual =
Test.prototype.equals =
Test.prototype.equal =
Test.prototype.is =
Test.prototype.eq;

Test.prototype.notDeepStrictEquals =
Test.prototype.notDeepStrictEqual =
Test.prototype.notDeepEquals =
Test.prototype.notDeepEqual =
Test.prototype.isNotEqual =
Test.prototype.notEquals =
Test.prototype.notEqual =
Test.prototype.isNot =
Test.prototype.neq =
Test.prototype.ne;

Test.prototype.greaterThan =
Test.prototype.greater =
Test.prototype.gt;

Test.prototype.greaterThanOrEquals =
Test.prototype.greaterThanOrEqual =
Test.prototype.greaterOrEquals =
Test.prototype.greaterOrEqual =
Test.prototype.ge =
Test.prototype.gte;

Test.prototype.lessThanOrEquals =
Test.prototype.lessThanOrEqual =
Test.prototype.lessOrEquals =
Test.prototype.lessOrEqual =
Test.prototype.le =
Test.prototype.lte;

Test.prototype.lessThan =
Test.prototype.less =
Test.prototype.lt;

Test.prototype.approximately =
Test.prototype.approx;

Test.prototype.instanceOf =
Test.prototype.instanceof =
Test.prototype.instance =
Test.prototype.typeOf =
Test.prototype.typeof =
Test.prototype.type;

Test.prototype.subTest =
Test.prototype.subtest =
Test.prototype.test;

module.exports = Test;
