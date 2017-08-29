import * as args from './args';
import chalk from 'chalk';
import readPercyConfig from '@percy-io/react-percy-config';
import { resolve as readWebpackConfig } from '@percy-io/react-percy-webpack';
import runPercy from '@percy-io/react-percy-ci';
import yargs from 'yargs';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const VERSION = require('../package.json').version;

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

  if (!process.env.PERCY_TOKEN) {
    process.stdout.write(
      chalk.bold.red('PERCY_TOKEN') + chalk.red(' environment variable must be set.'),
    );
    process.on('exit', () => process.exit(1));
    return;
  }

  if (!process.env.PERCY_PROJECT) {
    process.stdout.write(
      chalk.bold.red('PERCY_PROJECT') + chalk.red(' environment variable must be set.'),
    );
    process.on('exit', () => process.exit(1));
    return;
  }

  const packageRoot = rootDir || process.cwd();

  const percyConfig = readPercyConfig(packageRoot);
  const webpackConfig = readWebpackConfig(packageRoot, argv.config);

  return runPercy(percyConfig, webpackConfig, process.env.PERCY_TOKEN)
    .then(() => {
      process.on('exit', () => process.exit(0));
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.log(chalk.bold.red(err.stack || err));
      process.on('exit', () => process.exit(1));
    });
}
