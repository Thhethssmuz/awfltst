# awfltst

Async test harness and test runner.

## Usage

Use like if [bandage](https://npmjs.org/package/bandage) supported async functions.

```js
'use strict';
const test = require('awfltst');

test('My Test', async function () {
  this.eq(5, 2 + 3, 'addition works');
  const result = await Promise.resolve(true);
  this.ok(result, 'promise resolved correctly');
});

test('Alternatively', async (t) => {
  t.eq(6, 2 * 3, 'multiplication works');
});
```

Which you can run with the bundled `awfltst` executable:

```sh
$ awfltst test.js

  1 My Test 1 ms

    ✔ addition works
    ✔ promise resolved correctly

  2 Alternatively 0 ms

    ✔ multiplication works


  All tests passed!


  Total:      2 tests   3 assertions
  Passing:    2 tests   3 assertions
  Duration:   3 ms

```

## Binary

```
Usage:
  awfltst -h | --help
  awfltst -v | --version
  awfltst [-t | --test <test-name>]... [-g | --group <group-name>]...
          [-T | --skip-test <test-name>]... [-G | --skip-group <group-name>]...
          <file-path>...

Options:
  -h, --help                    Show usage information and exit.
  -v, --version                 Show version information and exit.
  -t, --test <test-name>        Exclusively execute a single named test.
  -T, --skip[-test] <test-name> Exclude a single named test from execution.
  -g, --group <group-name>      Exclusively execute a single test group.
  -G, --skip-group <group-name> Exclude a single test group from execution.
  --reporter spec|json          Set output format. Defaults to 'spec'.
  --[no-]colo[u]r               Force enable/disable coloured output.

```

## API

<a name="test"></a>

### test([name], [options], test)
Create a new Test.

**Kind**: global function  
**Params**

- [name] <code>String</code> - The name of this test.
- [options] <code>Object</code> - Options object.
    - [.skip] <code>Boolean</code> - Whether or not to skip this test.
    - [.only] <code>Boolean</code> - Whether or not to run only this test.
    - [.console] <code>Boolean</code> <code> = true</code> - Whether or not to capture console output.
    - [.group] <code>String</code> | <code>Array.&lt;String&gt;</code> - The group(s) this test belongs to.
    - [.inspect] <code>Object</code> - Options passed to `util.inspect` when reporting errors.
- test <code>function</code> - Test function.


* * *


<a name="this"></a>

### ~this : <code>object</code>
Test scope inside `test` function.

This object is also passed as the first and only argument to the `test`
function fore those that favours arrow functions.

**Kind**: inner namespace  

* [~this](#this) : <code>object</code>
    * [.stdout](#this.stdout) ⇒ <code>String</code>
    * [.stdout](#this.stdout)
    * [.stderr](#this.stderr) ⇒ <code>String</code>
    * [.stderr](#this.stderr)
    * [.plan](#this.plan) ⇒ <code>Test</code>
    * [.compare](#this.compare) ⇒ <code>Test</code>
    * [.chain](#this.chain) ⇒ <code>Test</code>
    * [.unchain](#this.unchain) ⇒ <code>Test</code>
    * [.fail](#this.fail) ⇒ <code>Test</code>
    * [.pass](#this.pass) ⇒ <code>Test</code>
    * [.error](#this.error) ⇒ <code>Test</code>
    * [.ok](#this.ok) ⇒ <code>Test</code>
    * [.not](#this.not) ⇒ <code>Test</code>
    * [.eq](#this.eq) ⇒ <code>Test</code>
    * [.ne](#this.ne) ⇒ <code>Test</code>
    * [.gt](#this.gt) ⇒ <code>Test</code>
    * [.gte](#this.gte) ⇒ <code>Test</code>
    * [.lte](#this.lte) ⇒ <code>Test</code>
    * [.lt](#this.lt) ⇒ <code>Test</code>
    * [.between](#this.between) ⇒ <code>Test</code>
    * [.notBetween](#this.notBetween) ⇒ <code>Test</code>
    * [.approx](#this.approx) ⇒ <code>Test</code>
    * [.contains](#this.contains) ⇒ <code>Test</code>
    * [.notContains](#this.notContains) ⇒ <code>Test</code>
    * [.in](#this.in) ⇒ <code>Test</code>
    * [.notIn](#this.notIn) ⇒ <code>Test</code>
    * [.type](#this.type) ⇒ <code>Test</code>
    * [.match](#this.match) ⇒ <code>Test</code>
    * [.notMatch](#this.notMatch) ⇒ <code>Test</code>
    * [.test](#this.test)
    * [.throws](#this.throws)
    * [.notThrows](#this.notThrows)


* * *

<a name="this.stdout"></a>

#### this.stdout ⇒ <code>String</code>
Getter for console output written to stdout during the test up until this
point.

**Kind**: static property of [<code>this</code>](#this)  

* * *

<a name="this.stdout"></a>

#### this.stdout
Setter for console output written to stdout during the test.

**Kind**: static property of [<code>this</code>](#this)  
**Params**

- value <code>String</code>


* * *

<a name="this.stderr"></a>

#### this.stderr ⇒ <code>String</code>
Getter for console output written to stderr during the test up until this
point.

**Kind**: static property of [<code>this</code>](#this)  

* * *

<a name="this.stderr"></a>

#### this.stderr
Setter for console output written to stderr during the test.

**Kind**: static property of [<code>this</code>](#this)  
**Params**

- value <code>String</code>


* * *

<a name="this.plan"></a>

#### this.plan ⇒ <code>Test</code>
Set the number of assertions planned for this test.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- expected <code>Number</code>
- [name] <code>String</code>


* * *

<a name="this.compare"></a>

#### this.compare ⇒ <code>Test</code>
Compare using a custom comparator function.

**Aliases**: `compareWith`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- comparator <code>function</code> - The comparator function to use for the assertion. The function is passed
the `actual` and `expected` values as is.
- actual <code>\*</code> - The actual value to be compared.
- expected <code>\*</code> - The expected value to be compared against.
- [name] <code>String</code> - A name identifying this assertion.
- [options] <code>Object</code> - Additional options.
    - [.operator] <code>String</code> - Override the operator value for the test output. Defaults to the name of
the comparator function or simply 'compare' if `comparator` has no name.
    - [.expected] <code>String</code> - Override the expected value in the test output. Defaults to inspecting the
value of `expected` using `util.inspect`.
    - [.actual] <code>String</code> - Override the actual value in the test output. Defaults to inspecting the
value of `actual` using `util.inspect`.
    - [.diffable] <code>Boolean</code> - Determine whether or not the actual and expected test output values are
diffed in the test output. Default to false.
    - [.at] <code>String</code> - Override the trace-line in the test output.


* * *

<a name="this.chain"></a>

#### this.chain ⇒ <code>Test</code>
Create a "chain test", a special form of sub-test created purely through
chaining calls on the returned Test instance.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this, ish...  
**Params**

- [name] <code>String</code>


* * *

<a name="this.unchain"></a>

#### this.unchain ⇒ <code>Test</code>
Return to the parent of this chain. Useful in nested chain tests.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - The chain's parent, or this if this is not a chain test.  

* * *

<a name="this.fail"></a>

#### this.fail ⇒ <code>Test</code>
Assertion that automatically fails.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- [name] <code>String</code>


* * *

<a name="this.pass"></a>

#### this.pass ⇒ <code>Test</code>
Assertion that automatically succeeds.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- [name] <code>String</code>


* * *

<a name="this.error"></a>

#### this.error ⇒ <code>Test</code>
Assertion that automatically fails with the given error.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- error <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.ok"></a>

#### this.ok ⇒ <code>Test</code>
Assert a "truthy" value.

**Aliases**: `true`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.not"></a>

#### this.not ⇒ <code>Test</code>
Assert a "falsy" value. Inverse of `ok`.

**Aliases**: `false`, `notOk`, `notok`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.eq"></a>

#### this.eq ⇒ <code>Test</code>
Assert deep equality.

**Aliases**: `deepStrictEquals`, `deepStrictEqual`, `deepEquals`,
  `deepEqual`, `equals`, `equal`, `is`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- expected <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.ne"></a>

#### this.ne ⇒ <code>Test</code>
Assert deep inequality. Inverse of `eq`.

**Aliases**: `notDeepStrictEquals`, `notDeepStrictEqual`, `notDeepEquals`,
  `notDeepEqual`, `isNotEqual`, `notEquals`, `notEqual`, `isNot`, `neq`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- expected <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.gt"></a>

#### this.gt ⇒ <code>Test</code>
Assert that `actual` is greater than `expected`.

**Aliases**: `greaterThan`, `greater`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- expected <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.gte"></a>

#### this.gte ⇒ <code>Test</code>
Assert that `actual` is greater than or equal to `expected`.

**Aliases**: `greaterThanOrEquals`, `greaterThanOrEqual`,
  `greaterOrEquals`, `greaterOrEqual`, `ge`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- expected <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.lte"></a>

#### this.lte ⇒ <code>Test</code>
Assert that `actual` is less than or equal to `expected`.

**Aliases**: `lessThanOrEquals`, `lessThanOrEqual`, `lessOrEquals`,
  `lessOrEqual`, `le`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- expected <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.lt"></a>

#### this.lt ⇒ <code>Test</code>
Assert that `actual` is less than `expected`.

**Aliases**: `lessThan`,  `less`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- expected <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.between"></a>

#### this.between ⇒ <code>Test</code>
Assert that `actual` is within the given range.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- min <code>\*</code>
- max <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.notBetween"></a>

#### this.notBetween ⇒ <code>Test</code>
Assert that `actual` is not within the given range. Inverse of `between`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- min <code>\*</code>
- max <code>\*</code>
- [name] <code>String</code>


* * *

<a name="this.approx"></a>

#### this.approx ⇒ <code>Test</code>
Assert that `actual` is equal to `expected` with a variance threshold of
± `variance`.

**Aliases**: `approximately`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>Number</code>
- expected <code>Number</code>
- variance <code>Number</code>
- [name] <code>String</code>


* * *

<a name="this.contains"></a>

#### this.contains ⇒ <code>Test</code>
Assert that `actual` contains `expected`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>String</code> | <code>Array</code>
- expected <code>String</code> | <code>Array</code>
- [name] <code>String</code>


* * *

<a name="this.notContains"></a>

#### this.notContains ⇒ <code>Test</code>
Assert that `actual` does not contain `expected`. Inverse of `contains`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>String</code> | <code>Array</code>
- expected <code>String</code> | <code>Array</code>
- [name] <code>String</code>


* * *

<a name="this.in"></a>

#### this.in ⇒ <code>Test</code>
Assert that `actual` is in `expected`. Reversed order version of
`contains`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>String</code> | <code>Array</code>
- expected <code>String</code> | <code>Array</code>
- [name] <code>String</code>


* * *

<a name="this.notIn"></a>

#### this.notIn ⇒ <code>Test</code>
Assert that `actual` is not in `expected`. Inverse of `in`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>String</code> | <code>Array</code>
- expected <code>String</code> | <code>Array</code>
- [name] <code>String</code>


* * *

<a name="this.type"></a>

#### this.type ⇒ <code>Test</code>
Assert that `actual` has a type of `expected` or is an instance of
`expected`.

**Aliases**: `instanceOf`, `instanceof`, `instance`, `typeOf`, `typeof`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>\*</code>
- expected <code>String</code> | <code>function</code>
- [name] <code>String</code>


* * *

<a name="this.match"></a>

#### this.match ⇒ <code>Test</code>
Assert that `actual` matches the given regular expression `expected`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>String</code>
- expected <code>RegExp</code>
- [name] <code>String</code>


* * *

<a name="this.notMatch"></a>

#### this.notMatch ⇒ <code>Test</code>
Assert that `actual` does not match the given regular expression
`expected`. Inverse of `match`.

**Kind**: static property of [<code>this</code>](#this)  
**Returns**: <code>Test</code> - this  
**Params**

- actual <code>String</code>
- expected <code>RegExp</code>
- [name] <code>String</code>


* * *

<a name="this.test"></a>

#### this.test
Create a sub-test.

**Aliases**: `subTest`, `subtest`.

**Kind**: static property of [<code>this</code>](#this)  
**Params**

- [name] <code>String</code>
- [options] <code>Object</code>
- test <code>function</code>


* * *

<a name="this.throws"></a>

#### this.throws
Assert that the given test-function throws.

**Kind**: static property of [<code>this</code>](#this)  
**Params**

- test <code>function</code> | <code>Promise</code>
- [expected] <code>RegExp</code> | <code>function</code>
- [name] <code>String</code>


* * *

<a name="this.notThrows"></a>

#### this.notThrows
Assert that the given test-function does not throw.

**Kind**: static property of [<code>this</code>](#this)  
**Params**

- test <code>function</code> | <code>Promise</code>
- [name] <code>String</code>


* * *


