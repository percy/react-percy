import uploadResource from '../uploadResource';

let percyClient;

beforeEach(() => {
  percyClient = {
    uploadResource: jest.fn(),
  };
});

it('uploads the specified resource', async () => {
  const build = {
    id: 'build123',
  };
  const resource = {
    content: 'resource contents',
  };
  percyClient.uploadResource.mockImplementation(() => Promise.resolve());

  await uploadResource(percyClient, build, resource);

  expect(percyClient.uploadResource).toHaveBeenCalledWith('build123', 'resource contents');
});

it('rejects the error response on failure', async () => {
  const build = {
    id: 'build123',
  };
  const resource = {
    content: 'resource contents',
  };
  const error = new Error('there was an error');
  percyClient.uploadResource.mockImplementation(() => Promise.reject(error));

  try {
    await uploadResource(percyClient, build, resource);
  } catch (e) {
    expect(e).toBe(error);
  }

  expect.assertions(1);
});
