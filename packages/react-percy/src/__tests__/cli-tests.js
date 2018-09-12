import { run } from '../cli';
import runPercy from '@percy/react-percy-ci';
import yargs from 'yargs';

const VERSION = require('../../package.json').version;

// eslint-disable-next-line no-console
console.log = jest.fn();

let mockYargs;
jest.mock('yargs', () => {
  const fakeYargs = () => mockYargs;
  fakeYargs.showHelp = jest.fn();
  return fakeYargs;
});

const mockPercyConfig = { percy: 'config' };
jest.mock('@percy/react-percy-config', () => () => mockPercyConfig);

jest.mock('@percy/react-percy-ci', () => jest.fn());

let argv;
let stdout;

beforeEach(() => {
  argv = {};
  mockYargs = {
    argv,
    alias: jest.fn(() => mockYargs),
    epilogue: jest.fn(() => mockYargs),
    help: jest.fn(() => mockYargs),
    options: jest.fn(() => mockYargs),
    usage: jest.fn(() => mockYargs),
  };

  process.exit = jest.fn();
  process.on = jest.fn((event, cb) => cb());

  stdout = [];
  process.stdout.write = message => stdout.push(message);

  delete process.env.PERCY_ENABLE;
  process.env.PERCY_TOKEN = 'token';
});

it('shows help text given help arg', async () => {
  argv.help = true;

  await run();

  expect(yargs.showHelp).toHaveBeenCalled();
});

it('exits with error code given help arg', async () => {
  argv.help = true;

  await run();

  expect(process.exit).toHaveBeenCalledWith(1);
});

it('prints the current `react-percy` version given version arg', async () => {
  argv.version = true;

  await run();

  expect(stdout.join('')).toBe(`v${VERSION}\n`);
});

it('exits with success code given version arg', async () => {
  argv.version = true;

  await run();

  expect(process.exit).toHaveBeenCalledWith(0);
});

it('exits with success code given PERCY_ENABLE environment variable is set to 0', async () => {
  process.env.PERCY_ENABLE = 0;

  await run();

  expect(process.exit).toHaveBeenCalledWith(0);
});

it('exits with error code given no PERCY_TOKEN environment variable', async () => {
  delete process.env.PERCY_TOKEN;

  await run();

  expect(process.exit).toHaveBeenCalledWith(1);
});

it('exits with success code given debug flag even with no PERCY_TOKEN environment variable', async () => {
  argv.debug = true;
  delete process.env.PERCY_TOKEN;
  runPercy.mockImplementation(() => Promise.resolve());

  await run();

  expect(process.exit).toHaveBeenCalledWith(0);
});

it('exits with success code given running succeeds', async () => {
  runPercy.mockImplementation(() => Promise.resolve());

  await run();

  expect(process.exit).toHaveBeenCalledWith(0);
});

it('exits with success code given Percy outage', async () => {
  runPercy.mockImplementation(() =>
    Promise.reject({
      name: 'StatusCodeError',
      statusCode: 500,
      error: { errors: [{ detail: 'Percy is down' }] },
    }),
  );

  await run();

  expect(process.exit).toHaveBeenCalledWith(0);
});

it('exits with error code given other Percy error', async () => {
  runPercy.mockImplementation(() =>
    Promise.reject({
      name: 'StatusCodeError',
      statusCode: 401,
      error: { errors: [{ detail: 'Invalid token' }] },
    }),
  );

  await run();

  expect(process.exit).toHaveBeenCalledWith(1);
});

it('exits with error code given running fails', async () => {
  runPercy.mockImplementation(() =>
    Promise.reject({
      name: 'Error',
      message: 'Some other sort of error',
    }),
  );

  await run();

  expect(process.exit).toHaveBeenCalledWith(1);
});
