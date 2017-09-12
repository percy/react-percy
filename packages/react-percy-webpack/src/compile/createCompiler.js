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
          loaders: [
            {
              test: /\.percy\.(js|jsx)/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                plugins: [require.resolve('babel-plugin-react-require')],
              },
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
            {
              test: /\.percy\.(js|jsx)/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  plugins: [require.resolve('babel-plugin-react-require')],
                },
              },
            },
          ],
        };

  const mergedWebpackConfig = merge(webpackConfig, {
    context: percyConfig.rootDir,
    output: {
      chunkFilename: '[name].chunk.js',
      filename: '[name].js',
      path: percyConfig.debug
        ? path.join(percyConfig.rootDir, '.percy-debug')
        : path.join(percyConfig.rootDir, 'static'),
      publicPath: '/',
    },
    module,
    plugins: percyConfig.debug ? [] : [new MemoryOutputPlugin('/static/')],
  });

  mergedWebpackConfig.plugins = mergedWebpackConfig.plugins.filter(
    plugin => !(plugin instanceof webpack.optimize.CommonsChunkPlugin),
  );

  return webpack(mergedWebpackConfig);
}
