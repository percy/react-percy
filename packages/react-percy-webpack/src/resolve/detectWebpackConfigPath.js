import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export default function detectWebpackConfigPath(packageRoot, resolve = require.resolve) {
  const defaultWebpackPath = path.join(packageRoot, 'webpack.config.js');
  if (fs.existsSync(defaultWebpackPath)) {
    return defaultWebpackPath;
  }

  const packageJson = require(path.join(packageRoot, 'package.json'));
  if (
    (packageJson.dependencies && packageJson.dependencies['react-scripts']) ||
    (packageJson.devDependencies && packageJson.devDependencies['react-scripts']) ||
    (packageJson.optionalDependencies && packageJson.optionalDependencies['react-scripts'])
  ) {
    try {
      return resolve('react-scripts/config/webpack.config.dev');
    } catch (e) {
      // Webpack config is not in the expected location
    }
  }

  throw new Error(
    chalk.red('No webpack config file found. Use ') +
      chalk.red.bold('`react-percy --config <path>`') +
      chalk.red(' to specify the path of your webpack config.'),
  );
}
