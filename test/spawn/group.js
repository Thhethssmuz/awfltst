'use strict';

const test = require('../..');

test('test with no group', async function () {
  this.pass();
});

test('test in g1', {group: 'g1'}, async function () {
  this.pass();
});

test('test in both g1 and g2', {group: ['g1', 'g2']}, async function () {
  this.pass();
});

test('test in g2', {group: 'g2'}, async function () {
  this.pass();
});

test('test in g3', {group: 'g3'}, async function () {
  this.pass();
  await this.test('sub-test in g3 inherit', async function () {
    this.pass();
  });
  await this.test('sub-test in g3 override', {group: 'g4'}, async function () {
    this.pass();
  });
});
