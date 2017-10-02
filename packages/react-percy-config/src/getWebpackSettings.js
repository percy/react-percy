/* eslint-disable no-console */

import chalk from 'chalk';
import path from 'path';

class ConfigError extends Error {
  constructor(message) {
    super(message);

    Error.stackTraceLimit = 0;
    Error.captureStackTrace(this, ConfigError);

    this.name = '';
    this.message = chalk.bold.red(`Error: ${message}`);
  }
}

function sanitizeCustomWebpackConfig(config = {}) {
  if (typeof config !== 'object') {
    throw new ConfigError(
      `The \`webpack\` field in percy.config.js must be a plain object, but was "${typeof config}".`,
    );
  }

  if (Array.isArray(config)) {
    throw new ConfigError(
      'The `webpack` field in percy.config.js must be a plain object, but was "array".',
    );
  }

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
          'Warning: automatically moved `webpack.module.loaders` field in percy.config.js to `webpack.module.rules` as react-percy requires a webpack 3 compatible config.',
        ),
      );
      config.module.rules = config.module.loaders;
      delete config.module.loaders;
    }

    if (config.module.preLoaders) {
      console.log(
        chalk.bold.yellow(
          'Warning: ignoring `webpack.module.preLoaders` field in percy.config.js as react-percy requires a webpack 3 compatible config.',
        ),
      );
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
