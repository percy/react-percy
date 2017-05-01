import runStory from '../runStory';
import runStories from '../runStories';

jest.mock('../runStory', () => jest.fn(() => Promise.resolve()));

it('runs stories for each test case', async () => {
    const percyClient = {};
    const build = {};
    const assets = {};
    const stories = [
        { name: 'story 1' },
        { name: 'story 2' }
    ];
    const storyHtml = '<html></html>';

    await runStories(percyClient, build, stories, [328, 768], assets, storyHtml);

    stories.forEach(story =>
        expect(runStory).toHaveBeenCalledWith(percyClient, build, story, [328, 768], assets, storyHtml)
    );
});
