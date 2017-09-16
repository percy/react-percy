import getEntry from '../entry';
import MemoryOutputPlugin from './MemoryOutputPlugin';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';

export default function createCompiler(percyConfig) {
  const config = merge.strategy({
    entry: 'replace',
    'module.rules': 'append',
    plugins: 'append',
  })(
    {
      bail: true,
      context: percyConfig.rootDir,
      devtool: '#cheap-module-source-map',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            loader: require.resolve('babel-loader'),
            query: {
              plugins: [require.resolve('babel-plugin-react-require')],
            },
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
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          },
        }),
        percyConfig.debug ? undefined : new MemoryOutputPlugin('/static/'),
      ].filter(plugin => plugin !== undefined),
      resolve: {
        alias: {
          'babel-runtime': path.dirname(require.resolve('babel-runtime/package.json')),
        },
        extensions: ['.js', '.json', '.jsx'],
      },
    },
    percyConfig.webpack,
    // The settings below always take precedence over user webpack configs
    {
      entry: getEntry(percyConfig),
      output: {
        chunkFilename: '[name].chunk.js',
        filename: '[name].js',
        path: percyConfig.debug
          ? path.join(percyConfig.rootDir, '.percy-debug')
          : path.join(percyConfig.rootDir, 'static'),
        publicPath: '/',
      },
    },
  );

  return webpack(config);
}
