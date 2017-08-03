import { storiesKey } from './constants';

/**
 * This map contains a mapping from stories for a kind to
 * widths the respective story should be rendered in,
 * looking like this:
 * {
 *   kindA: { story1: [widthX, widthY], storyX: [widthZ] },
 *   kindB: { story...}
 *   ...
 * }
 */
const contextWidthsTuples = new Map();

function assertWidths(widths) {
  widths.forEach(width => {
    if (isNaN(width) || width !== ~~width) {
      throw new Error("Given width '" + width + "' is invalid");
    }
  });
}

export const percyAddon = {
  addWithPercyWidths: function(storyName, storyFn, ...widths) {
    assertWidths(widths);

    contextWidthsTuples.set(this.kind, contextWidthsTuples.get(this.kind) || new Map());
    const tuplesForKind = contextWidthsTuples.get(this.kind);
    tuplesForKind.set(storyName, widths);
    this.add(storyName, context => storyFn(context));
  },
};

export const serializeStories = getStorybook => {
  const storybook = getStorybook();
  storybook.forEach(storyBucket => {
    if (!contextWidthsTuples.has(storyBucket.kind)) {
      return;
    }
    const tuplesForKind = contextWidthsTuples.get(storyBucket.kind);
    storyBucket.stories.forEach(story => {
      if (tuplesForKind.has(story.name)) {
        const customWidths = tuplesForKind.get(story.name);
        if (customWidths.length) {
          story.widths = customWidths;
        }
      }
    });
  });
  if (typeof window === 'object') window[storiesKey] = storybook;
};
