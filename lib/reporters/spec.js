'use strict';

const {log, error} = console;
const {diffLines} = require('diff');
const colors = Object.assign({}, require('util').inspect.colors);

const formatDuration = function (n) {
  if (n < 1000)
    return `${n} ms`;
  if (n < 60000)
    return `${Math.round(n / 1000)} s`;
  if (n < 3600000)
    return `${Math.round(n / 60000)} m`;
  return `${Math.round(n / 3600000)} h`;
};

class Spec {

  constructor(opts = {}) {
    this.test     = {total: 0, pass: 0, skip: 0};
    this.assert   = {total: 0, pass: 0, skip: 0};
    this.opts     = opts;
    this.duration = 0;
    this.current  = {id: [1], depth: 0, hide: 0};
    this.previous = 'end';
    this.errorSummary = [];
  }

  formatLine(xs, at) {
    if (this.opts.filename && at) {
      // const columns = process.stdout.columns || 0;
      // const length =
      //   xs.reduce((r, x) => r + x[0].length, this.current.depth) +
      //   xs.length + at.length;
      // const align = ' '.repeat(columns - (length % columns));
      xs.push([at, ['gray']]);
    }

    const indent = ' '.repeat(this.current.depth);
    const line = xs.map(([string, styles]) => {
      let tmp = string;
      if (this.opts.color)
        for (const style of styles)
          tmp = `\x1b[${colors[style][0]}m${tmp}\x1b[${colors[style][1]}m`;
      return tmp;
    }).join(' ');

    return indent + line;
  }

  formatHeader(result) {
    const xs = [];
    xs.push([this.current.id.join('.'), ['bold', 'underline']]);
    xs.push([result.name, ['bold', 'underline']]);
    if (result.ok === 'skipped') {
      xs.push(['(skipped)', ['white']]);
      xs[0][1].push('cyan');
      xs[1][1].push('cyan');
    }
    if (result.ok !== 'skipped' && typeof result.duration === 'number')
      xs.push([formatDuration(result.duration), ['white']]);

    return this.formatLine(xs, result.at);
  }

  formatAssertion(assertion) {
    const xs = [];
    xs.push(assertion.ok ? ['✔', ['bold', 'green']] : ['✘', ['bold', 'red']]);
    xs.push([assertion.name, assertion.ok ? ['white'] : ['red']]);
    if (typeof assertion.duration === 'number')
      xs.push([formatDuration(assertion.duration), ['white']]);

    return this.formatLine(xs, assertion.at);
  }

  reportSpacing(next) {
    const previous = this.previous;
    this.previous = next;

    if (next === 'end')
      return;
    if (previous === 'skipped' && next === 'skipped')
      return;
    if (previous === 'console' && next === 'console')
      return;
    if (previous === 'true' && next === 'true')
      return;

    log();
  }

  reportHeader(result) {
    let line;

    if (result.operator === 'chain') {
      line = this.formatAssertion(result);
      this.reportSpacing(String(result.ok));
      log(line);
    } else {
      line = this.formatHeader(result);
      this.reportSpacing(result.ok === 'skipped' ? 'skipped' : 'heading');
      log(line);
    }

    if (!result.ok && this.opts.summary)
      this.errorSummary.push(line);
  }

  reportAssertion(assertion) {
    if (assertion.ok === 'skipped')
      return;

    const line = this.formatAssertion(assertion);
    this.reportSpacing(String(assertion.ok));
    log(line);

    this.current.depth += 2;
    if (!assertion.ok) {
      this.reportError(assertion);
      if (this.opts.summary)
        this.errorSummary.push(line);
    }
    this.current.depth -= 2;
  }

  reportError(err) {
    const lines = [];

    if (err.at)
      lines.push([['At:', ['red']], ['     ', []], [err.at, []]]);

    if (err.operator)
      lines.push([['Operator:', ['red']], [err.operator, []]]);

    const expectedMultiLine = err.expected && err.expected.indexOf('\n') !== -1;
    const actualMultiline   = err.actual && err.actual.indexOf('\n') !== -1;

    if (err.diffable && expectedMultiLine && actualMultiline) {

      const markers = [[' ', []], ['+', ['green']], ['-', ['red']]];
      lines.push([['Expected:', ['red']], markers[2]]);
      lines.push([['Actual:', ['red']], [' ', []], markers[1]]);

      const diff = diffLines(err.expected, err.actual);
      for (const {added, removed, value} of diff) {
        const marker = markers[added && 1 || removed && 2 || 0];
        for (const line of value.replace(/\n$/, '').split('\n'))
          lines.push([[' ', []], marker, [line, []]]);
      }

    } else {

      if (err.expected && expectedMultiLine) {
        lines.push([['Expected:', ['red']]]);
        for (const line of err.expected.split('\n'))
          lines.push([[' ', []], [line, []]]);
      } else if (err.expected) {
        lines.push([['Expected:', ['red']], [err.expected, []]]);
      }

      if (err.actual && actualMultiline) {
        lines.push([['Actual:', ['red']]]);
        for (const line of err.actual.split('\n'))
          lines.push([[' ', []], [line, []]]);
      } else if (err.actual) {
        lines.push([['Actual:', ['red']], [' ', []], [err.actual, []]]);
      }

    }

    this.reportSpacing('error');
    log(lines.map(line => this.formatLine(line)).join('\n'));
  }

  reportConsole(content, streamId) {
    if (!content)
      return;

    const indent = ' '.repeat(this.current.depth);
    const block = content
      .replace(/\n*$/, '')
      .split('\n')
      .map(x => indent + x)
      .join('\n');

    this.reportSpacing('console');
    if (streamId === 'stderr')
      error(block);
    else
      log(block);
  }

  report(result) {
    if (result.operator !== 'chain') {
      this.test.total += 1;
      if (result.ok === 'skipped')
        this.test.skip += 1;
      else if (result.ok)
        this.test.pass += 1;
      if (this.current.depth === 0)
        this.duration += result.duration;

      this.current.depth += 2;
    }

    // if (!this.current.hide)
    this.reportHeader(result);

    if (result.operator !== 'chain')
      this.current.id.push(1);
    // if (this.opts.hideSuccessfulChains && result.ok)
    //   this.current.hide += 1;

    this.current.depth += 2;

    for (const {key, value} of result.results || []) {
      switch (key) {
        case 'stdout':
        case 'stderr':
          this.reportConsole(value, key);
          break;

        case 'test':
          this.report(value);
          break;

        case 'chain':
          this.assert.total += 1;
          if (value.ok === 'skipped')
            this.assert.skip += 1;
          else if (value.ok)
            this.assert.pass += 1;
          this.report(value);
          break;

        case 'assertion':
          this.assert.total += 1;
          if (value.ok === 'skipped')
            this.assert.skip += 1;
          else if (value.ok)
            this.assert.pass += 1;
          // if (!this.current.hide)
          this.reportAssertion(value);
          break;

        /* istanbul ignore next */
        default:
          throw new Error('invalid result type');
      }
    }

    this.current.depth -= 2;
    if (result.operator !== 'chain') {
      if (result.ok !== 'skipped')
        this.reportSpacing('end');
      this.current.id.pop();
      this.current.depth -= 2;
      this.current.id[this.current.id.length - 1] += 1;
    }
    // if (this.opts.hideSuccessfulChains && result.ok)
    //   this.current.hide -= 1;
  }

  summary() {
    this.test.fail = this.test.total - this.test.pass - this.test.skip;
    this.assert.fail = this.assert.total - this.assert.pass - this.assert.skip;
    this.current.depth += 2;
    const ok = this.test.fail === 0 && this.assert.fail === 0;

    const head = this.formatLine(ok ? [
      ['All tests passed!', ['bold', 'green']]
    ] : [
      ['Failed Tests:', ['bold', 'red']],
      ['There was', []],
      [this.test.fail, ['bold', 'red']],
      [`failed test${this.test.fail === 1 ? '' : 's'} with`, []],
      [this.assert.fail, ['bold', 'red']],
      [`failed assertion${this.assert.fail === 1 ? '' : 's'}!`, []]
    ]);

    const pluralize = xs => {
      for (const i of xs.keys())
        if (typeof xs[i] === 'number' && xs[i] !== 1)
          xs[i + 1] += 's';
      return xs;
    };

    const align = [false, true, false, true, false];
    const table = [
      ['Total:', this.test.total, 'test', this.assert.total, 'assertion'],
      ['Passing:', this.test.pass, 'test', this.assert.pass, 'assertion'],
      ['Failing:', this.test.fail, 'test', this.assert.fail, 'assertion'],
      this.assert.skip > 0 ?
        ['Skipped:', this.test.skip, 'test', this.assert.skip, 'assertion'] :
        ['Skipped:', this.test.skip, 'test'],
      ['Duration:', ...formatDuration(this.duration).split(' ')]
    ].map(xs => pluralize(xs).map(String));

    for (let i = 0; i < table[0].length; i += 1) {
      const max = table.reduce((l, row) =>
        row[i] ? Math.max(l, row[i].length) : l, 0);
      for (const row of table)
        if (row.length > i + 1)
          row[i] = row[i][align[i] ? 'padStart' : 'padEnd'](max + 1);
    }

    table[0] = this.formatLine([[table[0].join(' '), ['white']]]);
    table[1] = this.formatLine([[table[1].join(' '), ['green']]]);
    table[2] = this.formatLine([[table[2].join(' '), ['red']]]);
    table[3] = this.formatLine([[table[3].join(' '), ['cyan']]]);
    table[4] = this.formatLine([[table[4].join(' '), ['white']]]);

    log('\n');
    log(head);
    if (!ok && this.opts.summary) {
      log();
      log(this.errorSummary.join('\n'));
    }
    log('\n');
    log(table[0]);
    log(table[1]);
    if (!ok)
      log(table[2]);
    if (this.test.skip > 0)
      log(table[3]);
    log(table[4]);
    log();

    this.current.depth -= 2;
    return ok ? 0 : 1;
  }
}

module.exports = Spec;
