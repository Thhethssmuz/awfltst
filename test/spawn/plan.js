'use strict';

const test = require('../..');

test(async function () {
  this.plan(1);
  this.pass();
});

test(async function () {
  this.plan(1, 'test');
  this.pass();
});

test(async function () {
  this.plan(2);
  this.pass();
});

test(async function () {
  this.plan(2, 'test');
  this.pass();
});
