import path from 'path';
import getWebpackSettings from '../getWebpackSettings';

// eslint-disable-next-line no-console
console.log = jest.fn();

const packageRoot = path.normalize('/some/package/root');

let mockPackage;
jest.mock(require('path').normalize('/some/package/root/package.json'), () => mockPackage, {
  virtual: true,
});

jest.mock(
  'react-scripts/config/webpack.config.dev',
  () => ({
    entry: {
      'create-react-app': 'entry.js',
    },
    output: {
      path: '/create-react-app/',
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  }),
  {
    virtual: true,
  },
);

beforeEach(() => {
  jest.resetModules();

  mockPackage = {};
});

it('throws when a function is provided', () => {
  const webpack = () => ({
    plugins: ['foo'],
  });

  expect(() => getWebpackSettings(webpack, packageRoot)).toThrow();
});

it('throws when an array is provided', () => {
  const webpack = [
    {
      plugins: ['foo'],
    },
    {
      plugins: ['bar'],
    },
  ];

  expect(() => getWebpackSettings(webpack, packageRoot)).toThrow();
});

it('removes entry field off webpack config', () => {
  const webpack = {
    entry: {
      foo: 'bar',
    },
    plugins: ['foo'],
  };

  const settings = getWebpackSettings(webpack, packageRoot);

  expect(settings).toEqual({
    plugins: ['foo'],
  });
});

it('removes output field off webpack config', () => {
  const webpack = {
    output: {
      path: '/foo/bar',
    },
    plugins: ['foo'],
  };

  const settings = getWebpackSettings(webpack, packageRoot);

  expect(settings).toEqual({
    plugins: ['foo'],
  });
});

it('moves module loaders to module rules', () => {
  const webpack = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins: ['foo'],
  };

  const settings = getWebpackSettings(webpack, packageRoot);

  expect(settings).toEqual({
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins: ['foo'],
  });
});

it('removes module preLoaders field off webpack config', () => {
  const webpack = {
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          loader: 'eslint-loader',
        },
      ],
    },
    plugins: ['foo'],
  };

  const settings = getWebpackSettings(webpack, packageRoot);

  expect(settings).toEqual({
    module: {},
    plugins: ['foo'],
  });
});

it('returns create-react-app config when no webpack config is specified and react-scripts is a dependency', () => {
  mockPackage.dependencies = {
    'react-scripts': '^1.1.0',
  };

  const settings = getWebpackSettings(undefined, packageRoot);

  expect(settings).toEqual({
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  });
});

it('returns create-react-app config when no webpack config is specified and react-scripts is a devDependency', () => {
  mockPackage.devDependencies = {
    'react-scripts': '^1.1.0',
  };

  const settings = getWebpackSettings(undefined, packageRoot);

  expect(settings).toEqual({
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  });
});

it('returns create-react-app config when no webpack config is specified and react-scripts is a optionalDependency', () => {
  mockPackage.optionalDependencies = {
    'react-scripts': '^1.1.0',
  };

  const settings = getWebpackSettings(undefined, packageRoot);

  expect(settings).toEqual({
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
        },
      ],
    },
  });
});
