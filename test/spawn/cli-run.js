'use strict';

const test = require('../..');

test('test 1 -', async function () {});
test('test 2 []', {group: []}, async function () {});
test('test 3 [a]', {group: 'a'}, async function () {});
test('test 4 [b]', {group: 'b'}, async function () {});
test('test 5 [a, b]', {group: ['a', 'b']}, async function () {});
