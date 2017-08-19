import configureEntry, { SpecialFiles } from '../';

let mockSnapshotFiles = ['/foo/bar.percy.js', '/foo/__percy__/bar.js'];
jest.mock('../findSnapshotFiles', () => jest.fn(() => mockSnapshotFiles));

it('does not mutate the original Webpack config', () => {
  const originalConfig = {
    old: 'config',
  };
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy-io/percy-snapshot-render-react',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };
  const entry = 'const entry = true;';

  const modifiedConfig = configureEntry(originalConfig, percyConfig, entry);

  expect(modifiedConfig).not.toBe(originalConfig);
  expect(originalConfig).toEqual({
    old: 'config',
  });
});

it('percy entry contains snapshot files and renderer given no additional includes specified in percy options', () => {
  const originalConfig = {};
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy-io/percy-snapshot-render-react',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };
  const entry = 'const entry = true;';

  const modifiedConfig = configureEntry(originalConfig, percyConfig, entry);

  expect(modifiedConfig.entry).toEqual({
    [SpecialFiles.render]: '@percy-io/percy-snapshot-render-react',
    '__percy__/bar': '/foo/__percy__/bar.js',
    'bar.percy': '/foo/bar.percy.js',
  });
});

it('percy entry contains snapshot files, renderer, and additional included files specified in percy options', () => {
  const originalConfig = {};
  const percyConfig = {
    includeFiles: ['babel-polyfill', './src/foo.js'],
    renderer: '@percy-io/percy-snapshot-render-react',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };
  const entry = 'const entry = true;';

  const modifiedConfig = configureEntry(originalConfig, percyConfig, entry);

  expect(modifiedConfig.entry).toEqual({
    [SpecialFiles.render]: '@percy-io/percy-snapshot-render-react',
    [SpecialFiles.include]: ['babel-polyfill', './src/foo.js'],
    '__percy__/bar': '/foo/__percy__/bar.js',
    'bar.percy': '/foo/bar.percy.js',
  });
});
