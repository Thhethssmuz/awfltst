'use strict';
/* eslint-disable no-console */
let _hidden = 'lol';
const test = require('../..').extend({
  get lol() {
    console.log('getter called');
    return _hidden;
  },
  set lol(value) {
    console.log('setter called');
    _hidden = value;
  }
});

test.before(async function () {
  console.log(this.lol, _hidden);
});

test.after(async function () {
  console.log(this.lol, _hidden);
});

test(async function () {
  console.log(this.lol, _hidden);
  this.lol = 'rofl';
  console.log(this.lol, _hidden);
});
