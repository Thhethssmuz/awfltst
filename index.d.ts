declare module "awfltst" {
  import * as AWFLTST from "awfltst"

  // This should ideally be retrieved from the @types/node module, but
  // since this is the only requirement of that module, adding a
  // dependency on @types/node to the project seems like a waste.
  //
  // The only downside of doing it this way is that it won't
  // automatically get updated, in case the InspectOptions gets
  // additional options.
  export interface InspectOptions {
    getters?: 'get' | 'set' | boolean;
    showHidden?: boolean;

    depth?: number | null;
    colors?: boolean;
    customInspect?: boolean;
    showProxy?: boolean;
    maxArrayLength?: number | null;
    breakLength?: number;
    compact?: boolean | number;
    sorted?: boolean | ((a: string, b: string) => number);
  }

  export interface AwfltstOptions {
    skip?: boolean;
    only?: boolean;
    console?: boolean;
    inspect?: InspectOptions;
  }

  export interface ComparatorOptions {
    operator?: string;
    expected?: string;
    actual?: string;
    diffable?: boolean;
    at?: string;
  }

  export type TestFunction = (this: Test) => void;

  class Test {
    stdout: string
    stderr: string

    plan(expected: number, name?: string): Test;

    compare(comparator: Function, actual: any, expected: any, options?: ComparatorOptions): Test;
    compareWith(comparator: Function, actual: any, expected: any, options?: ComparatorOptions): Test;

    chain(name?: string) : Test;
    unchain(): Test;

    fail(name?: string): Test;
    pass(name?: string): Test;

    error(error: any, name?: string): Test;
    ok(actual: any, name?: string): Test;
    true(actual: any, name?: string): Test;

    not(actual: any, name?: string): Test;
    notOk(actual: any, name?: string): Test;
    notok(actual: any, name?: string): Test;
    false(actual: any, name?: string): Test;

    eq(actual: any, expected: any, name?: string): Test;
    deepStrictEquals(actual: any, expected: any, name?: string): Test;
    deepStrictEqual(actual: any, expected: any, name?: string): Test;
    deepEquals(actual: any, expected: any, name?: string): Test;
    deepEqual(actual: any, expected: any, name?: string): Test;
    equals(actual: any, expected: any, name?: string): Test;
    equal(actual: any, expected: any, name?: string): Test;
    is(actual: any, expected: any, name?: string): Test;

    ne(actual: any, expected: any, name?: string): Test;
    notDeepStrictEquals(actual: any, expected: any, name?: string): Test;
    notDeepStrictEqual(actual: any, expected: any, name?: string): Test;
    notDeepEquals(actual: any, expected: any, name?: string): Test;
    notDeepEqual(actual: any, expected: any, name?: string): Test;
    notEquals(actual: any, expected: any, name?: string): Test;
    notEqual(actual: any, expected: any, name?: string): Test;
    isNot(actual: any, expected: any, name?: string): Test;
    neq(actual: any, expected: any, name?: string): Test;

    gt(actual: any, expected: any, name?: string): Test;
    greaterThan(actual: any, expected: any, name?: string): Test;
    greater(actual: any, expected: any, name?: string): Test;

    gte(actual: any, expected: any, name?: string): Test;
    greaterThanOrEquals(actual: any, expected: any, name?: string): Test;
    greaterThanOrEqual(actual: any, expected: any, name?: string): Test;
    greaterOrEquals(actual: any, expected: any, name?: string): Test;
    greaterOrEqual(actual: any, expected: any, name?: string): Test;
    ge(actual: any, expected: any, name?: string): Test;

    lte(actual: any, expected: any, name?: string): Test;
    lessThanOrEquals(actual: any, expected: any, name?: string): Test;
    lessThanOrEqual(actual: any, expected: any, name?: string): Test;
    lessOrEquals(actual: any, expected: any, name?: string): Test;
    lessOrEqual(actual: any, expected: any, name?: string): Test;
    le(actual: any, expected: any, name?: string): Test;

    lt(actual: any, expected: any, name?: string): Test;
    lessThan(actual: any, expected: any, name?: string): Test;
    lessThan(actual: any, expected: any, name?: string): Test;

    between(actual: any, min: any, max: any, name?: string): Test;
    notBetween(actual: any, min: any, max: any, name?: string): Test;

    approx(actual: number, expected: number, variance: number, name?: string): Test;
    approximately(actual: number, expected: number, variance: number, name?: string): Test;

    contains(actual: string|Array<any>, expected: string|Array<any>, name?: string): Test;
    in(actual: string|Array<any>, expected: string|Array<any>, name?: string): Test;
    notIn(actual: string|Array<any>, expected: string|Array<any>, name?: string): Test;
    match(actual: string, expected: RegExp, name?: string): Test;
    notMatch(actual: string, expected: RegExp, name?: string): Test;

    type(actual: any, expected: Function|String, name?: string): Test
    instanceOf(actual: any, expected: Function|String, name?: string): Test
    instanceof(actual: any, expected: Function|String, name?: string): Test
    instance(actual: any, expected: Function|String, name?: string): Test
    typeOf(actual: any, expected: Function|String, name?: string): Test
    typeof(actual: any, expected: Function|String, name?: string): Test

    test(fn: TestFunction) : Promise<void>;
    test(name: string, fn: TestFunction) : Promise<void>;
    test(options: AwfltstOptions, fn: TestFunction) : Promise<void>;
    test(name: string, options: AwfltstOptions, fn: TestFunction) : Promise<void>;

    subTest(fn: TestFunction) : Promise<void>;
    subTest(name: string, fn: TestFunction) : Promise<void>;
    subTest(options: AwfltstOptions, fn: TestFunction) : Promise<void>;
    subTest(name: string, options: AwfltstOptions, fn: TestFunction) : Promise<void>;

    subtest(fn: Function) : Promise<void>;
    subtest(name: string, fn: Function) : Promise<void>;
    subtest(options: AwfltstOptions, fn: Function) : Promise<void>;
    subtest(name: string, options: AwfltstOptions, fn: Function) : Promise<void>;

    throws(test: Function|Promise<any>, expected?: RegExp|Function, name?: string): Promise<void>
      notThrows(test: Function|Promise<any>, expected?: RegExp|Function, name?: string): Promise<void>
  }

  export default function(fn: TestFunction) : void;
  export default function(name: string, fn: TestFunction) : void;
  export default function(options: AwfltstOptions, fn: TestFunction) : void;
  export default function(name: string, options: AwfltstOptions, fn: TestFunction) : void;
}
