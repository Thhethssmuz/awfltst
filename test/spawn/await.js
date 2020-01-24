'use strict';

const test = require('../..');
const wait = duration => new Promise(resolve => setTimeout(resolve, duration));

test('await', async function () {
  this.test('subtest', async function () {
    await wait(1000);
  });
  this.notThrows(async function () {
    await wait(1000);
  });
  this.throws(async function () {
    await wait(1000);
    throw new Error('lol');
  });
});
