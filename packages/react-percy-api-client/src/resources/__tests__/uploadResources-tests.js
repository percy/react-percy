import uploadResources from '../uploadResources';

let percyClient;

beforeEach(() => {
  percyClient = {
    uploadResources: jest.fn(),
  };
});

it('uploads the specified resources', async () => {
  const build = {
    id: 'buildid',
  };
  const resources = [
    {
      resourceUrl: '/a',
      content: 'a',
    },
    {
      resourceUrl: '/b',
      content: 'b',
    },
    {
      resourceUrl: '/c',
      content: 'c',
    },
  ];
  percyClient.uploadResources.mockImplementation(() => Promise.resolve());

  await uploadResources(percyClient, build, resources);

  expect(percyClient.uploadResources).toHaveBeenCalledWith(build.id, resources);
});

it('rejects the error response on failure', async () => {
  const build = {
    id: 'buildid',
  };
  const resources = [
    {
      resourceUrl: '/a',
      content: 'a',
    },
    {
      resourceUrl: '/b',
      content: 'b',
    },
    {
      resourceUrl: '/c',
      content: 'c',
    },
  ];
  const error = new Error('there was an error');
  percyClient.uploadResources.mockImplementation(() => Promise.reject(error));

  try {
    await uploadResources(percyClient, build, resources);
  } catch (e) {
    expect(e).toBe(error);
  }

  expect.assertions(1);
});
