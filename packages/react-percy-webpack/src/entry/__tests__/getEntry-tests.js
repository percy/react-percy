import { EntryNames } from '../constants';
import getEntry from '../';
import getEntryPath from '../getEntryPath';
import writeRenderEntry from '../writeRenderEntry';
import writeSnapshotsEntry from '../writeSnapshotsEntry';

const mockSnapshotFiles = ['/foo/bar.percy.js', '/foo/__percy__/bar.js'];
jest.mock('../findSnapshotFiles', () => jest.fn(() => mockSnapshotFiles));

const mockFrameworkFile = '/mock/framework.js';
const mockRenderFile = '/mock/render.js';
const mockSnapshotsFile = '/mock/snapshots.js';
jest.mock('../getEntryPath', () => jest.fn());

jest.mock('../writeRenderEntry');
jest.mock('../writeSnapshotsEntry');

beforeEach(() => {
  getEntryPath.mockImplementation(name => {
    switch (name) {
      case EntryNames.framework:
        return mockFrameworkFile;
      case EntryNames.render:
        return mockRenderFile;
      case EntryNames.snapshots:
        return mockSnapshotsFile;
    }
  });

  writeRenderEntry.mockReset();
  writeSnapshotsEntry.mockReset();
});

it('returns framework entry', () => {
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy/react-percy-snapshot-render',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };

  const entry = getEntry(percyConfig);

  expect(entry).toEqual(
    expect.objectContaining({
      [EntryNames.framework]: mockFrameworkFile,
    }),
  );
});

it('writes render entry file', () => {
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy/react-percy-snapshot-render',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };

  getEntry(percyConfig);

  expect(writeRenderEntry).toHaveBeenCalledWith(percyConfig, mockRenderFile);
});

it('returns render entry', () => {
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy/react-percy-snapshot-render',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };

  const entry = getEntry(percyConfig);

  expect(entry).toEqual(
    expect.objectContaining({
      [EntryNames.render]: mockRenderFile,
    }),
  );
});

it('writes snapshots entry file', () => {
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy/react-percy-snapshot-render',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };

  getEntry(percyConfig);

  expect(writeSnapshotsEntry).toHaveBeenCalledWith(mockSnapshotFiles, mockSnapshotsFile);
});

it('returns snapshots entry containing snapshots entry file given no include files in percy config', () => {
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy/react-percy-snapshot-render',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };

  const entry = getEntry(percyConfig);

  expect(entry).toEqual(
    expect.objectContaining({
      [EntryNames.snapshots]: [mockSnapshotsFile],
    }),
  );
});

it('returns snapshots entry containing include files and snapshots entry file given include files in percy config', () => {
  const percyConfig = {
    includeFiles: ['babel-polyfill', './src/foo.js'],
    renderer: '@percy/react-percy-snapshot-render',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };

  const entry = getEntry(percyConfig);

  expect(entry).toEqual(
    expect.objectContaining({
      [EntryNames.snapshots]: ['babel-polyfill', './src/foo.js', mockSnapshotsFile],
    }),
  );
});

it('returns vendor entry containing react and react-dom', () => {
  const percyConfig = {
    includeFiles: [],
    renderer: '@percy/react-percy-snapshot-render',
    rootDir: '/foo',
    snapshotPatterns: ['**/__percy__/*.js', '**/*.percy.js'],
  };

  const entry = getEntry(percyConfig);

  expect(entry).toEqual(
    expect.objectContaining({
      [EntryNames.vendor]: ['react', 'react-dom'],
    }),
  );
});
