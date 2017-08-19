import MemoryOutputPlugin from './MemoryOutputPlugin';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';

export default function createCompiler(percyConfig, webpackConfig) {
  return webpack(
    merge(webpackConfig, {
      output: {
        path: path.join(percyConfig.rootDir, 'static'),
        publicPath: '/static/',
      },
      plugins: [new MemoryOutputPlugin('/static/')],
    }),
  );
}
