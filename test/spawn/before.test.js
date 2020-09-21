'use strict';

const test = require('../..');

test.before(async function () {
  this.eq('before', 'before');
});

test(async function () {

  test.before(async function () {
    this.eq('inner.before', 'inner.before');
  });

  test(async function () {
    this.eq('inner.test', 'inner.test');
  });

  this.eq('test', 'test');

});
