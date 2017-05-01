import createSnapshot from '../../snapshot/createSnapshot';
import finalizeSnapshot from '../../snapshot/finalizeSnapshot';
import runStory from '../runStory';
import { uploadResources } from '../../resources';

const mockResource = { resource: true };
let mockMissingResources;
jest.mock('../../resources', () => ({
    makeRootResource: jest.fn(() => mockResource),
    getMissingResourceShas: jest.fn(() => mockMissingResources),
    uploadResources: jest.fn(() => Promise.resolve())
}));

const mockSnapshot = { id: 'snapshotid' };
jest.mock('../../snapshot/createSnapshot', () => jest.fn(() => Promise.resolve(mockSnapshot)));

jest.mock('../../snapshot/finalizeSnapshot', () => jest.fn(() => Promise.resolve()));

let percyClient;
let build;
let assets;
let storyHtml;

beforeEach(() => {
    percyClient = {};
    build = { id: 'buildid' };
    assets = {};
    storyHtml = '<html></html>';
    mockMissingResources = [];
});

it('creates a snapshot for the given test case', async () => {
    const story = {
        name: 'test case',
        markup: '<div>test</div>'
    };

    await runStory(percyClient, build, story, [320, 768], assets, storyHtml);

    expect(createSnapshot).toHaveBeenCalledWith(percyClient, build, [mockResource], { name: 'test case', widths: [320, 768], enableJavaScript: true });
});

it('does not re-upload resource given nothing has changed', async () => {
    const story = {
        name: 'test case',
        markup: '<div>test</div>'
    };
    mockMissingResources = [];

    await runStory(percyClient, build, story, [320, 768], assets, storyHtml);

    expect(uploadResources).not.toHaveBeenCalled();
});

it('re-uploads resource given changes', async () => {
    const story = {
        name: 'test case',
        markup: '<div>test</div>'
    };
    mockMissingResources = ['foo'];

    await runStory(percyClient, build, story, [320, 768], assets, storyHtml);

    expect(uploadResources).toHaveBeenCalledWith(percyClient, build, [mockResource]);
});

it('finalizes the snapshot', async () => {
    const story = {
        name: 'test case',
        markup: '<div>test</div>'
    };

    await runStory(percyClient, build, story, assets, storyHtml);

    expect(finalizeSnapshot).toHaveBeenCalledWith(percyClient, mockSnapshot, 'test case');
});
