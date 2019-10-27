'use strict';

const test = require('../..');

test({console: false}, async function () {
  console.log('\x1enot json');
});
