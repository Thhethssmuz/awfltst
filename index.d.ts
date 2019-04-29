declare module "awfltst" {
  import * as AWFLTST from "awfltst"
  import {InspectOptions} from 'util';

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

  export type TestFunction = (this: Test, t: Test) => void;

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

    eq<T>(actual: T, expected: T, name?: string): Test;
    deepStrictEquals<T>(actual: T, expected: T, name?: string): Test;
    deepStrictEqual<T>(actual: T, expected: T, name?: string): Test;
    deepEquals<T>(actual: T, expected: T, name?: string): Test;
    deepEqual<T>(actual: T, expected: T, name?: string): Test;
    equals<T>(actual: T, expected: T, name?: string): Test;
    equal<T>(actual: T, expected: T, name?: string): Test;
    is<T>(actual: T, expected: T, name?: string): Test;

    ne<T>(actual: T, expected: T, name?: string): Test;
    notDeepStrictEquals<T>(actual: T, expected: T, name?: string): Test;
    notDeepStrictEqual<T>(actual: T, expected: T, name?: string): Test;
    notDeepEquals<T>(actual: T, expected: T, name?: string): Test;
    notDeepEqual<T>(actual: T, expected: T, name?: string): Test;
    notEquals<T>(actual: T, expected: T, name?: string): Test;
    notEqual<T>(actual: T, expected: T, name?: string): Test;
    isNot<T>(actual: T, expected: T, name?: string): Test;
    neq<T>(actual: T, expected: T, name?: string): Test;

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

    contains<T>(actual: Array<T>, expected: T, name?: string): Test;
    contains(actual: string, expected: string, name?: string): Test;
    notContains<T>(actual: Array<T>, expected: T, name?: string): Test;
    notContains(actual: string, expected: string, name?: string): Test;

    in<T>(actual: T, expected: Array<T>, name?: string): Test;
    in(actual: string, expected: string, name?: string): Test;
    notIn<T>(actual: T, expected: Array<T>, name?: string): Test;
    notIn(actual: string, expected: string, name?: string): Test;

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
    throws(test: Function|Promise<any>, name?: string): Promise<void>
    notThrows(test: Function|Promise<any>, expected?: RegExp|Function, name?: string): Promise<void>
    notThrows(test: Function|Promise<any>, name?: string): Promise<void>
  }

  export default function(fn: TestFunction) : void;
  export default function(name: string, fn: TestFunction) : void;
  export default function(options: AwfltstOptions, fn: TestFunction) : void;
  export default function(name: string, options: AwfltstOptions, fn: TestFunction) : void;
}
