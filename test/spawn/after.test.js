'use strict';

const test = require('../..');

test.after(async function () {
  this.eq('after', 'after');
});

test(async function () {

  test.after(async function () {
    this.eq('inner.after', 'inner.after');
  });

  test(async function () {
    this.eq('inner.test', 'inner.test');
  });

  this.eq('test', 'test');

});
