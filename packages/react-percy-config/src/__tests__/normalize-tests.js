import defaults from '../defaults';
import normalize from '../normalize';
import path from 'path';

it('sets `debug` to false given `debug` mode is off', () => {
  const config = {};
  const packageRoot = '/package/root';
  const debug = false;

  const normalizedConfig = normalize(config, packageRoot, debug);

  expect(normalizedConfig.debug).toBe(false);
});

it('sets `debug` to true given `debug` mode is on', () => {
  const config = {};
  const packageRoot = '/package/root';
  const debug = true;

  const normalizedConfig = normalize(config, packageRoot, debug);

  expect(normalizedConfig.debug).toBe(true);
});

it('sets `includeFiles` to an empty array given no `includeFiles` in config', () => {
  const config = {};
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.includeFiles).toEqual([]);
});

it('sets `includeFiles` to `includeFiles` from config', () => {
  const config = {
    includeFiles: ['foo.js', 'bar'],
  };
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.includeFiles).toEqual(['foo.js', 'bar']);
});

it('sets `renderer` to `renderer` from config', () => {
  const config = {
    renderer: 'foo',
  };
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.renderer).toBe('foo');
});

it('sets `renderer` to @percy-io/percy-snapshot-render-react given no `renderer` in config', () => {
  const config = {};
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.renderer).toBe('@percy-io/percy-snapshot-render-react');
});

it('sets `rootDir` to the package root given no `rootDir` in config', () => {
  const config = {};
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.rootDir).toEqual(packageRoot);
});

it('sets `rootDir` to normalized `rootDir` from config', () => {
  const config = {
    rootDir: '/config/foo/../root',
  };
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.rootDir).toEqual(path.normalize('/config/root'));
});

it('sets default `snapshotIgnorePatterns` given none specified in config', () => {
  const config = {};
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.snapshotIgnorePatterns).toEqual(defaults.snapshotIgnorePatterns);
});

it('sets `snapshotIgnorePatterns` to `snapshotIgnorePatterns` from config', () => {
  const config = {
    snapshotIgnorePatterns: ['**/__percy__/**/*.ignore.js'],
  };
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.snapshotIgnorePatterns).toEqual(['**/__percy__/**/*.ignore.js']);
});

it('sets default `snapshotPatterns` given none specified in config', () => {
  const config = {};
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.snapshotPatterns).toEqual(defaults.snapshotPatterns);
});

it('sets `snapshotPatterns` to `snapshotPatterns` from config', () => {
  const config = {
    snapshotPatterns: ['**/*.snapshot.js'],
  };
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.snapshotPatterns).toEqual(['**/*.snapshot.js']);
});

it('sets `webpack` to an empty object given none specified in config', () => {
  const config = {};
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.webpack).toEqual({});
});

it('sets `webpack` to `webpack` from config', () => {
  const config = {
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
  const packageRoot = '/package/root';

  const normalizedConfig = normalize(config, packageRoot);

  expect(normalizedConfig.webpack).toEqual({
    module: {
      rules: [
        {
          test: /\.css$/,
          loader: 'css-loader',
        },
      ],
    },
  });
});
