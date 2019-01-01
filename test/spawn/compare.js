'use strict';

const test = require('../..');

test(async function () {

  this.plan(9);

  let f = () => true;

  await this.throws(() => {
    this.compare();
  }, TypeError, 'comparator must be a function');

  await this.throws(() => {
    this.compare(f);
  }, TypeError, 'actual must be specified');

  await this.throws(() => {
    this.compare(f, 1);
  }, TypeError, 'expected must be specified');

  this.compare(() => true, 1, 1);
  this.compare(f, 1, 1);
  this.compare(() => true, 1, 1, 'test');

  f = () => false;
  this.compare(() => false, 1, 1);
  this.compare(f, 1, 1, {operator: 'lol'});
  this.compare(f, 1, 1, 'test', {operator: 'lol'});
});
