import Environment from '../Environment';

let mockFrameworkGlobals;
jest.mock('@percy-io/react-percy-test-framework', () => context => {
  Object.keys(mockFrameworkGlobals).forEach(key => {
    context[key] = mockFrameworkGlobals[key];
  });
});

let environment;
let suiteSnapshots;

beforeEach(() => {
  suiteSnapshots = [];
  mockFrameworkGlobals = {
    percySnapshot: jest.fn(name => suiteSnapshots.push(name)),
    suite: jest.fn((name, fn) => fn()),
  };

  environment = new Environment();
});

it('can parse basic files', async () => {
  await environment.runScript({
    path: '/foo/bar.percy.js',
    src: `
            const a = 1;
        `,
  });
});

it('references to window work', async () => {
  await environment.runScript({
    path: '/foo/bar.percy.js',
    src: `
            const location = window.location.href;
        `,
  });
});

it('references to document work', async () => {
  await environment.runScript({
    path: '/foo/bar.percy.js',
    src: `
            const body = document.body;
        `,
  });
});

it('framework globals work', async () => {
  await environment.runScript({
    path: '/foo/bar.percy.js',
    src: `
            percySnapshot('snapshot', () => {
            });
        `,
  });

  expect(mockFrameworkGlobals.percySnapshot).toHaveBeenCalledWith('snapshot', expect.any(Function));
});

it('wraps script in a suite', async () => {
  await environment.runScript({
    path: '/foo/bar.percy.js',
    src: `
            percySnapshot('snapshot', () => {
            });
        `,
  });

  expect(mockFrameworkGlobals.suite).toHaveBeenCalledWith('', expect.any(Function));
  expect(suiteSnapshots).toEqual(['snapshot']);
});
