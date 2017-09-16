/* eslint-disable no-console */

import chalk from 'chalk';
import path from 'path';

function sanitizeCustomWebpackConfig(config = {}) {
  // Do not allow users to customize the entry config
  if (config.entry) {
    console.log(chalk.bold.yellow('Warning: ignoring `webpack.entry` field in percy.config.js.'));
    delete config.entry;
  }

  // Do not allow users to customize the output config
  if (config.output) {
    console.log(chalk.bold.yellow('Warning: ignoring `webpack.output` field in percy.config.js.'));
    delete config.output;
  }

  // Move module.loaders to module.rules so we can properly merge with them
  if (config.module) {
    if (config.module.loaders) {
      console.log(
        chalk.bold.yellow(
          'Warning: found `webpack.module.loaders` field in percy.config.js, but react-percy requires a webpack 3 compatible config.',
        ),
      );
      console.log(
        chalk.bold.yellow(
          '`webpack.module.loaders` have been automatically moved to `webpack.module.rules`.',
        ),
      );
      config.module.rules = config.module.loaders;
      delete config.module.loaders;
    }

    if (config.module.preLoaders) {
      console.log(
        chalk.bold.yellow(
          'Warning: found `webpack.module.preLoaders` field in percy.config.js, but react-percy requires a webpack 3 compatible config.',
        ),
      );
      console.log(chalk.bold.yellow('`webpack.module.preLoaders` have been removed.'));
      delete config.module.preLoaders;
    }
  }

  return config;
}

export default function getWebpackSettings(webpack, packageRoot) {
  if (!webpack) {
    const packageJson = require(path.join(packageRoot, 'package.json'));

    // create-react-app
    if (
      (packageJson.dependencies && packageJson.dependencies['react-scripts']) ||
      (packageJson.devDependencies && packageJson.devDependencies['react-scripts']) ||
      (packageJson.optionalDependencies && packageJson.optionalDependencies['react-scripts'])
    ) {
      try {
        // eslint-disable-next-line import/no-extraneous-dependencies
        webpack = require('react-scripts/config/webpack.config.dev');

        // Strip out ESLint pre-loader as it complains about Percy globals
        // and create-react-app offers no way to adjust the ESLint rules
        webpack.module.rules =
          webpack.module &&
          webpack.module.rules &&
          webpack.module.rules.filter(rule => rule.enforce !== 'pre');
      } catch (e) {
        // create-react-app webpack config is not in the expected location
      }
    }
  }

  return sanitizeCustomWebpackConfig(webpack);
}
