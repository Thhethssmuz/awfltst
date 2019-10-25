'use strict';

const {execFile} = require('child_process');

const exec = function (...args) {
  return new Promise(resolve => {
    const env = Object.assign({}, process.env, {'NO_COLOR': 'true'});
    const args_ = args.filter(x => typeof x === 'string');
    const opts_ = args.find(x => typeof x === 'object') || {env};
    execFile('./bin.js', args_, opts_, (err, stdout, stderr) => {
      const result = {
        stdout: stdout.split('\n').slice(0, -1),
        stderr: stderr.split('\n').slice(0, -1),
        code  : err && err.code || 0
      };
      resolve(result);
    });
  });
};

module.exports = async function (...args) {
  const result = await exec('--reporter=spec', ...args);
  result.stdout = result.stdout.map(x => x.replace(/\d+ (ms|s|m|h)$/, '_ ms'));
  result.stderr = result.stderr.map(x => x.replace(/\d+ (ms|s|m|h)$/, '_ ms'));

  /* eslint-disable no-regex-spaces */
  const summaryParts = [
    /^(  Total:      )(\s*\d+)( test)(s)?(   )(\s*\d+)( assertions?)$/,
    /^(  Passing:    )(\s*\d+)( test)(s)?(   )(\s*\d+)( assertions?)$/,
    /^(  Failing:    )(\s*\d+)( test)(s)?(   )(\s*\d+)( assertions?)$/,
    /^(  Skipped:    )(\s*\d+)( test)(s)?()()()$/,
    /^(  Duration:   )(\s*_)( ms)()()()()$/
  ];
  /* eslint-enable no-regex-spaces */

  // eslint-disable-next-line max-params
  const sanitizeSummary = (_, a, b, c, d, e, f, g) =>
    a + (b.trim() + (c || '') + (d || ' ') + (e || '') + (f || '').trim() +
    (g || '')).trim();

  for (const reg of summaryParts)
    result.stdout = result.stdout.map(x => x.replace(reg, sanitizeSummary));

  return result;
};

module.exports.json = async function (...args) {
  const result = await exec('--reporter=json', ...args);
  result.stdout = result.stdout.map(line => {
    try {
      return JSON.parse(line);
    } catch (err) {
      return line;
    }
  });
  return result;
};
