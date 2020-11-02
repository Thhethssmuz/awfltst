#!/usr/bin/env node
'use strict';

const test = require('.');
const json = require('./lib/json');
const {resolve} = require('path');
const {log, error} = console;
const hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

const doc =
`Usage:
  awfltst -h | --help
  awfltst -v | --version
  awfltst [-t | --test <test-name>]... [-g | --group <group-name>]...
          [-T | --skip-test <test-name>]... [-G | --skip-group <group-name>]...
          <file-path>...

Options:
  -h, --help                    Show usage information and exit.
  -v, --version                 Show version information and exit.
  -t, --test <test-name>        Exclusively execute a single named test.
  -T, --skip[-test] <test-name> Exclude a single named test from execution.
  -g, --group <group-name>      Exclusively execute a single test group.
  -G, --skip-group <group-name> Exclude a single test group from execution.
  --depth <depth>               Set max depth for nested properties in output.
  --reporter spec|json          Set output format. Defaults to 'spec'.
  --json                        Reformat previous json output from stdin.
  --[no-]colo[u]r               Force enable/disable coloured output.
  --[no-]capture-console        Force enable/disable console capture.
  --[no-]filename               Force enable/disable filename from being added
                                to test names.
`;

const options = {};
const argv = process.argv.slice(2);
const pushback = [];
while (argv.length) {
  const arg = (pushback.pop() || '') + argv.shift();

  switch (arg) {

    case '-h':
    case '--help':
      log(doc);
      return process.exit(0);

    case '-v':
    case '--version':
      log(`awfltst v${require('./package').version}`);
      return process.exit(0);

    case '-t':
    case '--test':
    case '--only':
      options.only = options.only || [];
      options.only.push(argv.shift());
      pushback.pop();
      break;

    case '-T':
    case '--skip':
    case '--skip-test':
      options.skip = options.skip || [];
      options.skip.push(argv.shift());
      pushback.pop();
      break;

    case '-g':
    case '--group':
      options.group = options.group || [];
      options.group.push(argv.shift());
      pushback.pop();
      break;

    case '-G':
    case '--skip-group':
      options.skipGroup = options.skipGroup || [];
      options.skipGroup.push(argv.shift());
      pushback.pop();
      break;

    case '--depth':
      if (!/^\d+$/.test(argv[0])) {
        error(`awfltst: invalid depth \`${argv[0]}'`);
        return process.exit(1);
      }
      options.depth = parseInt(argv.shift(), 10);
      break;

    case '--reporter':
      options.reporter = argv.shift().toLowerCase();
      pushback.pop();
      if (['spec', 'json'].indexOf(options.reporter) === -1) {
        error(`awfltst: invalid reporter \`${options.reporter}'`);
        return process.exit(1);
      }
      break;

    case '--json':
      options.json = true;
      break;

    case '--color':
    case '--colour':
      options.color = true;
      break;

    case '--no-color':
    case '--no-colour':
      options.color = false;
      break;

    case '--capture-console':
      options.console = true;
      break;
    case '--no-capture-console':
      options.console = false;
      break;

    case '--filename':
      options.filename = true;
      break;
    case '--no-filename':
      options.filename = false;
      break;

    case '--':
      options.files = options.files || [];
      options.files = options.files.concat(argv.splice(0, Infinity));
      break;

    default:
      if (arg.indexOf('--') === 0 && arg.indexOf('=') !== -1) {
        argv.unshift(arg.replace(/.*?=/, ''));
        argv.unshift(arg.replace(/[=].*/, ''));
        break;
      }

      if (arg.indexOf('--') === 0) {
        error(`awfltst: invalid option \`${arg}'`);
        return process.exit(1);
      }

      if (arg[0] === '-' && arg.length > 2) {
        pushback.push('-', '');
        argv.unshift(arg.slice(2));
        argv.unshift(arg.slice(0, 2));
        break;
      }

      if (arg[0] === '-') {
        error(`awfltst: invalid option \`${arg}'`);
        return process.exit(1);
      }

      options.files = options.files || [];
      options.files.push(arg);
  }
}

if (options.json)
  return json(options);

if (!options.files) {
  error('awfltst: missing <file-path>...');
  process.exit(1);
}

if (!hasOwnProperty(options, 'color')) {
  options.color =
    !hasOwnProperty(process.env, 'NO_COLOR') && process.stdout._type === 'tty';
}

for (const file of options.files)
  require(resolve(file));

test._run(options).then(process.exit);
