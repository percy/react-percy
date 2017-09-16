import path from 'path';

function sanitizeCustomWebpackConfig(config = {}) {
  // Do not allow users to customize the entry config
  delete config.entry;

  // Do not allow users to customize the output config
  delete config.output;

  // Move module.loaders to module.rules so we can properly merge with them
  if (config.module && config.module.loaders) {
    config.module.rules = config.module.loaders;
    delete config.module.loaders;
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
