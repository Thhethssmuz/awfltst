'use strict';

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
        process.stdout.write(tmp.slice(0, match.index));

      try {
        reporter.report(JSON.parse(match[1]));
      } catch (err) {
        process.stdout.write(match[0]);
      }

      tmp = tmp.slice(match.index + match[0].length);
    }
  });

  process.stdin.on('end', () => {
    if (tmp) process.stdout.write(tmp);
    reporter.summary();
  });
};
