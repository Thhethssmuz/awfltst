'use strict';

const test = require('../..');
const once = true;

test.before({once}, () => console.log('Before all'));
test.before({once, group: []}, () => console.log('Before none'));
test.before({once, group: 'A'}, () => console.log('Before A'));
test.before({once, group: 'B'}, () => console.log('Before B'));
test.before({once, group: ['A', 'B']}, () => console.log('Before A or B'));
test.before({once, skipGroup: 'A'}, () => console.log('Not before A'));
test.before({once, skipGroup: 'B'}, () => console.log('Not before B'));
test.before({once, skipGroup: ['A', 'B']}, () =>
  console.log('Not before A or B'));

test('none', function () {});
test('A', {group: 'A'}, function () {});
test('B', {group: ['B']}, function () {});
test('A and B', {group: ['A', 'B']}, function () {});
