// eslint-disable-next-line import/no-extraneous-dependencies
import * as percy from 'percy-client';
import path from 'path';
import { run } from '@percy-io/react-percy/lib/cli';

process.env.PERCY_PROJECT = 'test/project';
process.env.PERCY_TOKEN = 'fake token';

jest.mock('percy-client');
jest.mock('@percy-io/react-percy-ci/lib/reporter');

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const packageRoot = path.resolve(path.join(__dirname, '../'));

beforeEach(() => {
  percy.createBuild.mockClear();
  percy.createSnapshot.mockClear();
  percy.finalizeBuild.mockClear();
  percy.finalizeSnapshot.mockClear();
  percy.uploadResource.mockClear();
});

const expectPercyToHaveRunSnapshots = () => {
  const expectedSnapshots = 3;
  const expectedAssets = 4;

  expect(percy.createBuild).toHaveBeenCalledTimes(1);
  expect(percy.uploadResource).toHaveBeenCalledTimes(expectedAssets);
  expect(percy.createSnapshot).toHaveBeenCalledTimes(expectedSnapshots);
  expect(percy.finalizeSnapshot).toHaveBeenCalledTimes(expectedSnapshots);
  expect(percy.finalizeBuild).toHaveBeenCalledTimes(1);
};

it('handles ES5 webpack configs', async () => {
  await run(['--config', require.resolve('../webpack/webpack.config.js')], packageRoot);

  expectPercyToHaveRunSnapshots();
});

it('handles ES6 webpack configs', async () => {
  await run(['--config', require.resolve('../webpack/webpack.config.babel.js')], packageRoot);

  expectPercyToHaveRunSnapshots();
});
