'use strict';

const test = require('../..');
const once = true;

test.after({once}, () => console.log('After all'));
test.after({once, group: []}, () => console.log('After none'));
test.after({once, group: 'A'}, () => console.log('After A'));
test.after({once, group: 'B'}, () => console.log('After B'));
test.after({once, group: ['A', 'B']}, () => console.log('After A or B'));
test.after({once, skipGroup: 'A'}, () => console.log('Not after A'));
test.after({once, skipGroup: 'B'}, () => console.log('Not after B'));
test.after({once, skipGroup: ['A', 'B']}, () =>
  console.log('Not after A or B'));

test('none', function () {});
test('A', {group: 'A'}, function () {});
test('B', {group: ['B']}, function () {});
test('A and B', {group: ['A', 'B']}, function () {});
