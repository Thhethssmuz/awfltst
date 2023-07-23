'use strict';
/* eslint-disable no-console, no-empty-function */
const test = require('../..');

test.after(() => console.log('After all'));
test.after({group: []}, () => console.log('After none'));
test.after({group: 'A'}, () => console.log('After A'));
test.after({group: 'B'}, () => console.log('After B'));
test.after({group: ['A', 'B']}, () => console.log('After A or B'));
test.after({skipGroup: 'A'}, () => console.log('Not after A'));
test.after({skipGroup: 'B'}, () => console.log('Not after B'));
test.after({skipGroup: ['A', 'B']}, () => console.log('Not after A or B'));

test('none', function () {});
test('A', {group: 'A'}, function () {});
test('B', {group: ['B']}, function () {});
test('A and B', {group: ['A', 'B']}, function () {});
