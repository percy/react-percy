import detectWebpackVersion from '../detectWebpackVersion';

let mockWebpackPackage;
jest.mock('webpack/package.json', () => mockWebpackPackage, { virtual: true });

beforeEach(() => {
  jest.resetModules();
});

it('returns 1 given webpack 1.x', () => {
  mockWebpackPackage = {
    version: '1.13.1',
  };

  const version = detectWebpackVersion();

  expect(version).toBe(1);
});

it('returns 2 given webpack 2.x', () => {
  mockWebpackPackage = {
    version: '2.5.0',
  };

  const version = detectWebpackVersion();

  expect(version).toBe(2);
});

it('returns 3 given webpack 3.x', () => {
  mockWebpackPackage = {
    version: '3.1.0',
  };

  const version = detectWebpackVersion();

  expect(version).toBe(3);
});
