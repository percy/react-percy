import babelConfig from './babelConfig';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import getEntry from '../entry';
import MemoryOutputPlugin from './MemoryOutputPlugin';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';

export default function createCompiler(percyConfig) {
  const config = merge.smartStrategy({
    'module.rules': 'prepend',
    plugins: 'prepend',
  })(percyConfig.webpack, {
    bail: true,
    context: percyConfig.rootDir,
    devtool: percyConfig.webpack.devtool || '#cheap-module-source-map',
    entry: getEntry(percyConfig),
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: require.resolve('babel-loader'),
          query: babelConfig,
          exclude: /node_modules/,
        },
      ],
    },
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    output: {
      chunkFilename: '[name].chunk.js',
      filename: '[name].js',
      path: percyConfig.debug
        ? path.join(percyConfig.rootDir, '.percy-debug')
        : path.join(percyConfig.rootDir, 'static'),
      publicPath: percyConfig.debug ? '' : '/',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      }),
      new CaseSensitivePathsPlugin(),
      percyConfig.debug ? undefined : new MemoryOutputPlugin('/static/'),
    ].filter(plugin => plugin !== undefined),
    resolve: {
      alias: {
        'babel-runtime': path.dirname(require.resolve('babel-runtime/package.json')),
      },
      extensions: ['.js', '.json', '.jsx'],
    },
  });

  return webpack(config);
}
