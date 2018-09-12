import * as args from './args';
import chalk from 'chalk';
import readPercyConfig from '@percy/react-percy-config';
import runPercy from '@percy/react-percy-ci';
import yargs from 'yargs';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const VERSION = require('../package.json').version;

function formatError(error) {
  if (error.error && error.error.errors && error.error.errors.length) {
    return error.error.errors.map(e => e.detail).join(', ');
  }
  return error.stack || error;
}

// eslint-disable-next-line import/prefer-default-export
export function run(argv, rootDir) {
  argv = yargs(argv)
    .usage(args.usage)
    .help()
    .alias('help', 'h')
    .options(args.options)
    .epilogue(args.docs).argv;

  if (argv.help) {
    yargs.showHelp();
    process.on('exit', () => process.exit(1));
    return;
  }

  if (argv.version) {
    process.stdout.write(`v${VERSION}\n`);
    process.on('exit', () => process.exit(0));
    return;
  }

  if (process.env.PERCY_ENABLE === '0') {
    process.stdout.write('Percy is disabled by PERCY_ENABLE=0 environment variable. Skipping.\n');
    process.on('exit', () => process.exit(0));
    return;
  }

  if (!argv.debug && !process.env.PERCY_TOKEN) {
    process.stdout.write(
      chalk.bold.red('PERCY_TOKEN') + chalk.red(' environment variable must be set.\n'),
    );
    process.on('exit', () => process.exit(1));
    return;
  }

  const packageRoot = rootDir || process.cwd();

  const percyConfig = readPercyConfig(packageRoot, argv.debug);

  return runPercy(percyConfig, process.env.PERCY_TOKEN)
    .then(() => {
      process.on('exit', () => process.exit(0));
    })
    .catch(err => {
      if (err.name === 'StatusCodeError') {
        if (err.statusCode >= 500) {
          // eslint-disable-next-line no-console
          console.log(chalk.bold.yellow('Percy Error: %s'), formatError(err));
          process.on('exit', () => process.exit(0));
        } else {
          // eslint-disable-next-line no-console
          console.log(chalk.bold.red('Error: %s'), formatError(err));
          process.on('exit', () => process.exit(1));
        }
      } else {
        // eslint-disable-next-line no-console
        console.log(chalk.bold.red('%s'), formatError(err));
        process.on('exit', () => process.exit(1));
      }
    });
}
