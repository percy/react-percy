export default function getWebpackConfigExports(webpackConfig) {
  if (Array.isArray(webpackConfig)) {
    throw new Error('Percy does not support arrays of webpack configs');
  }

  if (typeof webpackConfig.default !== 'undefined') {
    webpackConfig = webpackConfig.default;
  }

  if (typeof webpackConfig === 'function') {
    return webpackConfig();
  }

  return webpackConfig;
}
