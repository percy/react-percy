import detectWebpackVersion from './detectWebpackVersion';
import MemoryOutputPlugin from './MemoryOutputPlugin';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';

const percySnapshotPreloader = {
  test: /\.percy\.(js|jsx)/,
  exclude: /node_modules/,
  loader: require.resolve('./percySnapshotLoader'),
};

export default function createCompiler(percyConfig, webpackConfig) {
  const webpackVersion = detectWebpackVersion();

  let module;
  if (webpackVersion === 1) {
    module = {
      preLoaders: [percySnapshotPreloader],
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
    };
  } else if (webpackConfig.module && webpackConfig.module.loaders) {
    module = {
      loaders: [
        {
          ...percySnapshotPreloader,
          enforce: 'pre',
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
  } else {
    module = {
      rules: [
        {
          ...percySnapshotPreloader,
          enforce: 'pre',
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
  }

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
