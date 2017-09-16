import babelConfig from '../babelConfig';
import createCompiler from '../createCompiler';
import path from 'path';
import webpack from 'webpack';

class WebpackCompiler {}
const mockCompiler = () => new WebpackCompiler();
jest.mock('webpack', () => {
  const webpack = jest.fn(() => mockCompiler());
  webpack.DefinePlugin = class MockDefinePlugin {};
  return webpack;
});

jest.mock(
  '../MemoryOutputPlugin',
  () =>
    class mockMemoryOutputPlugin {
      mock = 'MemoryOutputPlugin';
    },
);

const mockEntry = {
  entry: 'mock',
};
jest.mock('../../entry', () => jest.fn(() => mockEntry));

beforeEach(() => {
  webpack.mockClear();
});

it('bails on errors', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      bail: true,
    }),
  );
});

it('sets context to the project root directory', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      context: '/foo/bar',
    }),
  );
});

it('adds percy entries', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      entry: mockEntry,
    }),
  );
});

it('adds babel rule', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        rules: expect.arrayContaining([
          expect.objectContaining({
            test: /\.(js|jsx)$/,
            loader: require.resolve('babel-loader'),
            query: babelConfig,
            exclude: /node_modules/,
          }),
        ]),
      }),
    }),
  );
});

it('includes custom rules', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {
      module: {
        rules: [
          {
            test: /\.css$/,
            loader: 'css-loader',
          },
        ],
      },
    },
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      module: expect.objectContaining({
        rules: expect.arrayContaining([
          expect.objectContaining({
            test: /\.css$/,
            loader: 'css-loader',
          }),
        ]),
      }),
    }),
  );
});

it('uses custom devtool setting when specified', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {
      devtool: 'source-map',
    },
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      devtool: 'source-map',
    }),
  );
});

it('sets default devtool when none is specified', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      devtool: '#cheap-module-source-map',
    }),
  );
});

it('sets output public path to an empty string in debug mode', () => {
  const percyConfig = {
    debug: true,
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      output: expect.objectContaining({
        publicPath: '',
      }),
    }),
  );
});

it('sets output public path to `/` when not in debug mode', () => {
  const percyConfig = {
    debug: false,
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      output: expect.objectContaining({
        publicPath: '/',
      }),
    }),
  );
});

it('outputs to static folder given debug mode is off', () => {
  const percyConfig = {
    debug: false,
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

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
    webpack: {},
  };

  createCompiler(percyConfig);

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
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).toHaveBeenCalledWith(
    expect.objectContaining({
      plugins: expect.arrayContaining([
        expect.objectContaining({
          mock: 'MemoryOutputPlugin',
        }),
      ]),
    }),
  );
});

it('does not add MemoryOutputPlugin given debug mode is on', () => {
  const percyConfig = {
    debug: true,
    rootDir: '/foo/bar',
    webpack: {},
  };

  createCompiler(percyConfig);

  expect(webpack).not.toHaveBeenCalledWith(
    expect.objectContaining({
      plugins: expect.arrayContaining([
        expect.objectContaining({
          mock: 'MemoryOutputPlugin',
        }),
      ]),
    }),
  );
});

it('returns a webpack compiler', () => {
  const percyConfig = {
    rootDir: '/foo/bar',
    webpack: {},
  };

  const compiler = createCompiler(percyConfig);

  expect(compiler).toBeInstanceOf(WebpackCompiler);
});
