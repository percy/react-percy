import loadFile from '../loadFile';
import path from 'path';
import readPercyConfig from '../';

jest.mock('../loadFile', () => jest.fn(() => ({})));

const mockNormalizedConfig = { normalized: true };
jest.mock('../normalize', () => () => mockNormalizedConfig);

it('loads percy config file from package root', () => {
  readPercyConfig(path.normalize('/package/root'));

  expect(loadFile).toHaveBeenCalledWith(path.normalize('/package/root/percy.config.js'));
});

it('returns normalized percy config', () => {
  const config = readPercyConfig(path.normalize('/package/root'));

  expect(config).toEqual(mockNormalizedConfig);
});
