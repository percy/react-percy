import finalizeBuild from '../finalizeBuild';

let percyClient;

beforeEach(() => {
  percyClient = {
    finalizeBuild: jest.fn(),
  };
});

it('finalizes the specified build', async () => {
  const build = {
    id: 'buildid',
  };
  percyClient.finalizeBuild.mockImplementation(() => Promise.resolve());

  await finalizeBuild(percyClient, build);

  expect(percyClient.finalizeBuild).toHaveBeenCalledWith(build.id);
});

it('rejects the error response on failure', async () => {
  const build = {
    id: 'buildid',
  };
  const error = new Error('there was an error');
  percyClient.finalizeBuild.mockImplementation(() => Promise.reject(error));

  try {
    await finalizeBuild(percyClient, build);
  } catch (e) {
    expect(e).toBe(error);
  }

  expect.assertions(1);
});
