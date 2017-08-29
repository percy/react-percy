import detectWebpackVersion from './detectWebpackVersion';
import MemoryOutputPlugin from './MemoryOutputPlugin';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';

export default function createCompiler(percyConfig, webpackConfig) {
  const webpackVersion = detectWebpackVersion();

  const module =
    webpackVersion === 1
      ? {
          preLoaders: [
            {
              test: /\.percy\.(js|jsx)/,
              exclude: /node_modules/,
              loader: require.resolve('./percySnapshotLoader'),
            },
          ],
        }
      : {
          rules: [
            {
              test: /\.percy\.(js|jsx)/,
              exclude: /node_modules/,
              enforce: 'pre',
              loader: require.resolve('./percySnapshotLoader'),
            },
          ],
        };

  const mergedWebpackConfig = merge(webpackConfig, {
    output: {
      chunkFilename: '[name].chunk.js',
      filename: '[name].js',
      path: path.join(percyConfig.rootDir, 'static'),
      publicPath: '/',
    },
    module,
    plugins: [new MemoryOutputPlugin('/static/')],
  });

  mergedWebpackConfig.plugins = mergedWebpackConfig.plugins.filter(
    plugin => !(plugin instanceof webpack.optimize.CommonsChunkPlugin),
  );

  return webpack(mergedWebpackConfig);
}
