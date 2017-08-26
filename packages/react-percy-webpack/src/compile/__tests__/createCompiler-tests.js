import createCompiler from '../createCompiler';
import detectWebpackVersion from '../detectWebpackVersion';
import webpack from 'webpack';

class WebpackCompiler {}
const mockCompiler = () => new WebpackCompiler();
jest.mock('webpack', () => jest.fn(() => mockCompiler()));

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
