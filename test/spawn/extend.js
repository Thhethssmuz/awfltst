'use strict';

const test = require('../..');
const ext = test.extend({
  lol() {
    this.fail('lol');
  }
});

test.before(async function () {
  this.not(this.lol, 'before lack property "lol"');
});

test.after(async function () {
  this.not(this.lol, 'after lack property "lol"');
});

test('test', async function () {
  this.not(this.lol, 'test lack property "lol"');
  await this.test('non-extended inline subtest', async function () {
    this.not(this.lol, 'non-extended inline subtest lack property "lol"');
  });
  test('non-extended subtest', async function () {
    this.not(this.lol, 'non-extended subtest lack property "lol"');
  });
  ext('extended subtest', async function () {
    this.ok(this.lol, 'extended subtest has property "lol"');
  });
});


ext.before(async function () {
  this.ok(this.lol, 'extended before has property "lol"');
});

ext.after(async function () {
  this.ok(this.lol, 'extended after has property "lol"');
});

ext('extended', async function () {
  this.ok(this.lol, 'extended test has property "lol"');
  await this.test('extended inline subtest', async function () {
    this.ok(this.lol, 'extended inline subtest has property "lol"');
  });
  test('non-extended subtest', async function () {
    this.not(this.lol, 'non-extended subtest lack property "lol"');
  });
  ext('extended subtest', async function () {
    this.ok(this.lol, 'extended subtest has property "lol"');
  });
});
