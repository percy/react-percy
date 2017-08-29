import * as path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import interpret from 'interpret';
import getExtension from './getExtension';
import registerCompiler from './registerCompiler';

export default function requireWebpackConfig(webpackConfigPath) {
  const resolvedWebpackConfigPath = path.resolve(webpackConfigPath);
  if (!fs.existsSync(resolvedWebpackConfigPath)) {
    throw new Error(
      chalk.red('Webpack config file ') +
        chalk.red.bold(webpackConfigPath) +
        chalk.red(' could not be found.'),
    );
  }

  const extension = getExtension(resolvedWebpackConfigPath);
  registerCompiler(interpret.extensions[extension]);

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(resolvedWebpackConfigPath);
}
