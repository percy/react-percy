import createCompiler from '../createCompiler';
import detectWebpackVersion from '../detectWebpackVersion';
import webpack from 'webpack';

class WebpackCompiler {}
const mockCompiler = () => new WebpackCompiler();
jest.mock('webpack', () => {
  const webpack = jest.fn(() => mockCompiler());
  webpack.optimize = {
    CommonsChunkPlugin: class MockCommonsChunkPlugin {
      mock = 'CommonsChunkPlugin';
    },
  };
  return webpack;
});

jest.mock('../detectWebpackVersion', () => jest.fn());

beforeEach(() => {
  detectWebpackVersion.mockReturnValue(3);
  webpack.mockClear();
});

it('adds percy snapshot loader as a preloader given webpack 1', () => {
  detectWebpackVersion.mockReturnValue(1);
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        preLoaders: expect.arrayContaining([
          {
            test: /\.percy\.(js|jsx)/,
            exclude: /node_modules/,
            loader: require.resolve('../percySnapshotLoader'),
          },
        ]),
      }),
    }),
  );
});

it('adds percy snapshot loader as a pre-enforced rule given webpack 2', () => {
  detectWebpackVersion.mockReturnValue(2);
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        rules: expect.arrayContaining([
          {
            test: /\.percy\.(js|jsx)/,
            exclude: /node_modules/,
            enforce: 'pre',
            loader: require.resolve('../percySnapshotLoader'),
          },
        ]),
      }),
    }),
  );
});

it('adds percy snapshot loader as a pre-enforced rule given webpack 3', () => {
  detectWebpackVersion.mockReturnValue(3);
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        rules: expect.arrayContaining([
          {
            test: /\.percy\.(js|jsx)/,
            exclude: /node_modules/,
            enforce: 'pre',
            loader: require.resolve('../percySnapshotLoader'),
          },
        ]),
      }),
    }),
  );
});

it('removes commons chunk plugins', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin();
  const webpackConfig = {
    plugins: [commonsChunkPlugin, 'foo'],
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack.mock.calls[0][0].plugins).not.toContain(commonsChunkPlugin);
});

it('does not remove other plugins', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    plugins: [new webpack.optimize.CommonsChunkPlugin(), 'foo'],
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack.mock.calls[0][0].plugins).toContain('foo');
});

it('returns a webpack compiler', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  const compiler = createCompiler(percyConfig, webpackConfig);

  expect(compiler).toBeInstanceOf(WebpackCompiler);
});
