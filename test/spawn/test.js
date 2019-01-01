'use strict';

const test = require('../..');

test(async function () {
  await this.test(function () {
    this.pass();
  });
  await this.test(async function () {
    this.pass();
  }, 'test');
  await this.test({skip: true}, function () {
    this.fail();
  });
  await this.test({skip: true}, async function () {
    this.fail();
  }, 'test');
  await this.test(function () {
    // eslint-disable-next-line no-throw-literal
    throw null;
  });
  await this.test('test', async function () {
    this.fail();
  });
});

test(async function () {

  await this.throws(
    async () => this.test(),
    /Missing test function/,
    'test function required');

  const func = async function () {
    this.pass();
  };
  const name = 'name';
  const opts = {};

  await this.test(func);
  await this.test(name, func);
  await this.test(func, name);
  await this.test(opts, func);
  await this.test(func, opts);
  await this.test(name, opts, func);
  await this.test(name, func, opts);
  await this.test(opts, name, func);
  await this.test(opts, func, name);
  await this.test(func, name, opts);
  await this.test(func, opts, name);
});
