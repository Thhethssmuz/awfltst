'use strict';

const test = require('../..');

test(async function () {
  this.chain().pass();
  this.chain('test').pass();
  this.chain().fail();
  this.chain('test').fail();

  this.chain().chain().pass();
  this.chain().chain().fail();

  /* eslint-disable indent */
  this
    .chain()
      .chain()
        .pass()
        .unchain()
      .pass()
      .chain()
        .pass()
        .unchain()
      .pass()
      .unchain()
    .pass()
    .unchain()
  .pass();
});
