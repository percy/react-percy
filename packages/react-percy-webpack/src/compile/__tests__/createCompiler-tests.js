import createCompiler from '../createCompiler';
import detectWebpackVersion from '../detectWebpackVersion';
import path from 'path';
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
jest.mock(
  '../MemoryOutputPlugin',
  () =>
    class mockMemoryOutputPlugin {
      mock = 'MemoryOutputPlugin';
    },
);

beforeEach(() => {
  detectWebpackVersion.mockReturnValue(3);
  webpack.mockClear();
});

it('sets context to the project root directory', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    context: '/some/other/context',
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      context: '/foo/bar',
    }),
  );
});

it('adds percy snapshot loader as a preloader given webpack 1', () => {
  detectWebpackVersion.mockReturnValue(1);
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
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

it('adds percy snapshot loader as a pre-enforced rule given webpack 2 config with rules', () => {
  detectWebpackVersion.mockReturnValue(2);
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
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

it('adds percy snapshot loader as a pre-enforced loader given webpack 2 config with loaders', () => {
  detectWebpackVersion.mockReturnValue(2);
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        loaders: expect.arrayContaining([
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

it('outputs to static folder given debug mode is off', () => {
  const percyConfig = {
    debug: false,
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      output: expect.objectContaining({
        path: path.normalize('/foo/bar/static'),
      }),
    }),
  );
});

it('outputs to .percy-debug folder given debug mode is on', () => {
  const percyConfig = {
    debug: true,
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      output: expect.objectContaining({
        path: path.normalize('/foo/bar/.percy-debug'),
      }),
    }),
  );
});

it('adds MemoryOutputPlugin given debug mode is off', () => {
  const percyConfig = {
    debug: false,
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack.mock.calls[0][0].plugins).toEqual(
    expect.arrayContaining([expect.objectContaining({ mock: 'MemoryOutputPlugin' })]),
  );
});

it('does not add MemoryOutputPlugin given debug mode is on', () => {
  const percyConfig = {
    debug: true,
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    config: true,
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack.mock.calls[0][0].plugins).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ mock: 'MemoryOutputPlugin' })]),
  );
});

it('adds percy snapshot babel loader given webpack 1', () => {
  detectWebpackVersion.mockReturnValue(1);
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        loaders: expect.arrayContaining([
          {
            test: /\.percy\.(js|jsx)/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              plugins: [require.resolve('babel-plugin-react-require')],
            },
          },
        ]),
      }),
    }),
  );
});

it('adds percy snapshot babel loader given webpack 2 config with rules', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        rules: expect.arrayContaining([
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
        ]),
      }),
    }),
  );
});

it('adds percy snapshot babel loader given webpack 2 config with loaders', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
  };
  const webpackConfig = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  };

  createCompiler(percyConfig, webpackConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        loaders: expect.arrayContaining([
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
