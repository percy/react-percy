import loadFromPackage from '../loadFromPackage';
import path from 'path';
import readPercyConfig from '../';

jest.mock('../loadFromPackage', () => jest.fn(() => ({})));

const mockNormalizedConfig = { normalized: true };
jest.mock('../normalize', () => () => mockNormalizedConfig);

it('loads package JSON file from package root', () => {
  readPercyConfig(path.normalize('/package/root'));

  expect(loadFromPackage).toHaveBeenCalledWith(path.normalize('/package/root/package.json'));
});

it('returns normalized percy config', () => {
  const config = readPercyConfig(path.normalize('/package/root'));

  expect(config).toEqual(mockNormalizedConfig);
});
