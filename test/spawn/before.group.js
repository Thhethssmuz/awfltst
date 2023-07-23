'use strict';
/* eslint-disable no-console, no-empty-function*/
const test = require('../..');

test.before(() => console.log('Before all'));
test.before({group: []}, () => console.log('Before none'));
test.before({group: 'A'}, () => console.log('Before A'));
test.before({group: 'B'}, () => console.log('Before B'));
test.before({group: ['A', 'B']}, () => console.log('Before A or B'));
test.before({skipGroup: 'A'}, () => console.log('Not before A'));
test.before({skipGroup: 'B'}, () => console.log('Not before B'));
test.before({skipGroup: ['A', 'B']}, () => console.log('Not before A or B'));

test('none', function () {});
test('A', {group: 'A'}, function () {});
test('B', {group: ['B']}, function () {});
test('A and B', {group: ['A', 'B']}, function () {});
