'use strict';

const test = require('../..');

const exit = (code) => setTimeout(() => process.exit(code), 0);
const throws = () => setTimeout(() => {
  throw new Error('lol');
}, 0);

test('exit-0', async function () {
  exit(0);
  await new Promise(resolve => setTimeout(resolve, 100));
});

test('exit-1', async function () {
  exit(1);
  await new Promise(resolve => setTimeout(resolve, 100));
});

test('uncaught', async function () {
  throws();
  await new Promise(resolve => setTimeout(resolve, 100));
});
