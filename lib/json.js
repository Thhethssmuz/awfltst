'use strict';

const {log} = console;
const reporters = require('./reporters');

module.exports = function (opts) {

  const reporter = new reporters[opts.reporter || 'spec'](opts);

  let tmp = '';

  process.stdin.on('data', chunk => {
    tmp += chunk;

    let match;
    // eslint-disable-next-line no-control-regex, no-cond-assign
    while (match = /\x1e([^\x1e\n]*)\n/g.exec(tmp)) {

      if (match.index !== 0)
        log(tmp.slice(0, match.index));

      try {
        reporter.report(JSON.parse(match[1]));
      } catch (err) {
        log(tmp.slice(0, match.index));
      }

      tmp = tmp.slice(match.index + match[0].length);
    }
  });

  process.stdin.on('end', () => {
    if (tmp) log(tmp);
    reporter.summary();
  });
};
