import fs from 'fs';
import loadFile from '../loadFile';

jest.mock('babel-register', () => jest.fn());

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

let mockConfig;
jest.mock('/fake/percy.config.js', () => mockConfig, { virtual: true });

beforeEach(() => {
  mockConfig = {};
});

it('returns an empty object when the config file does not exist', () => {
  fs.existsSync.mockReturnValue(false);

  const config = loadFile('/fake/percy.config.js');

  expect(config).toEqual({});
});

it('returns the config given file exists with CommonJS exports', () => {
  fs.existsSync.mockReturnValue(true);
  mockConfig = {
    snapshotPatterns: ['**/*.screenshots.js'],
  };

  const config = loadFile('/fake/percy.config.js');

  expect(config).toEqual({
    snapshotPatterns: ['**/*.screenshots.js'],
  });
});

it('returns the config given file exists with ES6 exports', () => {
  fs.existsSync.mockReturnValue(true);
  mockConfig = {
    default: {
      snapshotPatterns: ['**/*.screenshots.js'],
    },
  };

  const config = loadFile('/fake/percy.config.js');

  expect(config).toEqual({
    snapshotPatterns: ['**/*.screenshots.js'],
  });
});
