import { configure, getStorybook } from '@kadira/storybook';

import faker from 'faker';
import timemachine from 'timemachine';

// Seed faker so it generates deterministic fake data
faker.seed(123);
// Use timemachine to freeze the date to 2015
timemachine.config({
  dateString: 'October 21, 2015 13:12:59'
});

function loadStories() {
  require('../stories/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);

if (typeof window === 'object') window.__storybook_stories__ = getStorybook();
