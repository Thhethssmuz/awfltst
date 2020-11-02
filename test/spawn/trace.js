'use strict';
/* eslint-disable no-extra-parens */

const test = require('../..');
const {log} = console;

test(async function () {
  log((() => this.trace())());
  log((() => this.trace(0))());
  log((() => this.trace(1))());

  log((function () {
    return this.trace();
  }).call(this));
  log((function () {
    return this.trace(0);
  }).call(this));
  log((function () {
    return this.trace(1);
  }).call(this));
});

test('eval', async function () {
  // eslint-disable-next-line no-new-func
  log(new Function('return this.trace()').call(this));
  // eslint-disable-next-line no-eval
  log(eval('this.trace()'));
});
