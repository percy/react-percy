import createBuild from '../createBuild';

let percyClient;

beforeEach(() => {
  percyClient = {
    createBuild: jest.fn(),
  };
});

it('returns data when creating the build succeeds', async () => {
  percyClient.createBuild.mockImplementation(() =>
    Promise.resolve({
      body: {
        data: {
          attributes: {
            'web-url': 'http://foo.bar',
          },
          foo: 'bar',
        },
      },
    }),
  );

  const build = await createBuild(percyClient, [{}, {}]);

  expect(build).toEqual({
    attributes: {
      'web-url': 'http://foo.bar',
    },
    foo: 'bar',
  });
});

it('rejects the error response on failure', async () => {
  const error = new Error('there was an error');
  percyClient.createBuild.mockImplementation(() => Promise.reject(error));

  try {
    await createBuild(percyClient, [{}, {}]);
  } catch (e) {
    expect(e).toBe(error);
  }

  expect.assertions(1);
});
