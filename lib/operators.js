'use strict';

const assert = require('assert');
const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

const op = module.exports = {
  fail() {
    return false;
  },

  pass() {
    return true;
  },

  error() {
    return false;
  },

  ok(x) {
    return x;
  },

  not(x) {
    return !x;
  },

  try(f) {
    try { f(); } catch (err) { return err; }
  },

  eq(x, y) {
    return !op.try(() => assert.deepStrictEqual(x, y));
  },

  ne(x, y) {
    return !op.eq(x, y);
  },

  gt(x, y) {
    return x > y;
  },

  gte(x, y) {
    return x >= y;
  },

  lte(x, y) {
    return x <= y;
  },

  lt(x, y) {
    return x < y;
  },

  between(x, y) {
    return x >= y[0] && x <= y[1];
  },

  notBetween(x, y) {
    return !op.between(x, y);
  },

  approx(x, y) {
    return op.between(x, [y[0] - y[1], y[0] + y[1]]);
  },

  contains(x, y) {
    if (x === null || x === undefined || !x.indexOf)
      return false;
    return x.indexOf(y) !== -1;
  },

  notContains(x, y) {
    return !op.contains(x, y);
  },

  in(x, y) {
    return y.indexOf(x) !== -1;
  },

  notIn(x, y) {
    return !op.in(x, y);
  },

  type(x, y) {
    return typeof x === y;
  },

  instance(x, y) {
    return x instanceof y;
  },

  has(x, y) {
    if (x === null || x === undefined)
      return false;
    return hasOwnProperty(x, y);
  },

  lack(x, y) {
    return !op.has(x, y);
  },

  _match(x, y) {
    return y.test(x);
  },

  match(x, y) {
    return op.type(x, 'string') && op._match(x, y);
  },

  notMatch(x, y) {
    return !op.match(x, y);
  }
};
