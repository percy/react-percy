import PromisePool from 'es6-promise-pool';
import runStory from './runStory';

const concurrency = 5;

export default function runStories(percyClient, build, stories, widths, assets, storyHtml) {
    function* generatePromises() {
        for (const story of stories) {
            yield runStory(percyClient, build, story, widths, assets, storyHtml);
        }
    }

    const pool = new PromisePool(generatePromises(), concurrency);
    return pool.start();
}
