import defaults from '../defaults';
import normalize from '../normalize';
import path from 'path';

const mockWebpack = { mock: 'webpack' };
jest.mock('../getWebpackSettings', () => () => mockWebpack);

const packageRoot = '/package/root';
const configPath = '/package/root/percy.config.js';

it('sets `debug` to false given `debug` mode is off', () => {
  const config = {};
  const debug = false;

  const normalizedConfig = normalize(config, packageRoot, configPath, debug);

  expect(normalizedConfig.debug).toBe(false);
});

it('sets `debug` to true given `debug` mode is on', () => {
  const config = {};
  const debug = true;

  const normalizedConfig = normalize(config, packageRoot, configPath, debug);

  expect(normalizedConfig.debug).toBe(true);
});

it('sets `includeFiles` to an empty array given no `includeFiles` in config', () => {
  const config = {};

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.includeFiles).toEqual([]);
});

it('sets `includeFiles` to `includeFiles` from config', () => {
  const config = {
    includeFiles: ['foo.js', 'bar'],
  };

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.includeFiles).toEqual(['foo.js', 'bar']);
});

it('sets `renderer` to `renderer` from config', () => {
  const config = {
    renderer: 'foo',
  };

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.renderer).toBe('foo');
});

it('sets `renderer` to @percy/react-percy-snapshot-render given no `renderer` in config', () => {
  const config = {};

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.renderer).toBe('@percy/react-percy-snapshot-render');
});

it('sets `rootDir` to the package root given no `rootDir` in config', () => {
  const config = {};

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.rootDir).toEqual(packageRoot, configPath);
});

it('sets `rootDir` to normalized `rootDir` from config', () => {
  const config = {
    rootDir: '/config/foo/../root',
  };

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.rootDir).toEqual(path.normalize('/config/root'));
});

it('sets default `snapshotIgnorePatterns` given none specified in config', () => {
  const config = {};

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.snapshotIgnorePatterns).toEqual(defaults.snapshotIgnorePatterns);
});

it('sets `snapshotIgnorePatterns` to `snapshotIgnorePatterns` from config', () => {
  const config = {
    snapshotIgnorePatterns: ['**/__percy__/**/*.ignore.js'],
  };

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.snapshotIgnorePatterns).toEqual(['**/__percy__/**/*.ignore.js']);
});

it('sets default `snapshotPatterns` given none specified in config', () => {
  const config = {};

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.snapshotPatterns).toEqual(defaults.snapshotPatterns);
});

it('sets `snapshotPatterns` to `snapshotPatterns` from config', () => {
  const config = {
    snapshotPatterns: ['**/*.snapshot.js'],
  };

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.snapshotPatterns).toEqual(['**/*.snapshot.js']);
});

it('sets `webpack` to the loaded webpack settings', () => {
  const config = {};

  const normalizedConfig = normalize(config, packageRoot, configPath);

  expect(normalizedConfig.webpack).toEqual(mockWebpack);
});
