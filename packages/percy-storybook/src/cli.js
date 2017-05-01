import getStories from './getStories';
import getStaticAssets from './getStaticAssets';
import selectStories from './selectStories';
import uploadStories from './uploadStories';

import ApiClient from 'react-percy-api-client';
import createDebug from 'debug';

const debug = createDebug('percy-storybook');

// eslint-disable-next-line import/prefer-default-export
export async function run() {
    const stories = getStories();
    debug('stories %o', stories);

    const selectedStories = selectStories(stories);
    debug('selectedStories %o', selectedStories);

    const { storyHtml, assets } = getStaticAssets();
    debug('assets %o', assets);

    const client = new ApiClient(
      process.env.PERCY_TOKEN,
      process.env.PERCY_API
    );

    return uploadStories(client, selectedStories, storyHtml, assets);
}
