import ExtendableError from 'es6-error';
import { storiesKey } from './constants';

/**
 * This map contains a mapping from stories for a kind to
 * options of the respective story,
 * looking like this:
 * {
 *   kindA: { story1: options, storyX: options },
 *   kindB: { story...}
 *   ...
 * }
 */
const optionsTuples = new Map();

export class InvalidOptionError extends ExtendableError {}

function assertWidths(widths) {
  if (typeof widths === 'undefined') {
    return;
  }
  if (!widths.length) {
    throw new InvalidOptionError('Need at least one valid width');
  }
  widths.forEach(width => {
    if (isNaN(width) || width !== ~~width) {
      throw new InvalidOptionError("Given width '" + width + "' is invalid");
    }
  });
}

function assertRtl(rtl) {
  if (typeof rtl === 'undefined') {
    return;
  }
  if (typeof rtl !== 'boolean') {
    throw new InvalidOptionError("Given rtl setting '" + rtl + "' is invalid");
  }
}

export const percyAddon = {
  addWithPercyOptions: function(storyName, options, storyFn) {
    if (typeof options === 'function') {
      storyFn = options;
      options = undefined;
    }

    if (options) {
      assertWidths(options.widths);
      assertRtl(options.rtl);

      optionsTuples.set(this.kind, optionsTuples.get(this.kind) || new Map());
      const tuplesForKind = optionsTuples.get(this.kind);
      tuplesForKind.set(storyName, options);
    }
    this.add(storyName, context => storyFn(context));
  },
};

export const serializeStories = getStorybook => {
  const storybook = getStorybook();
  storybook.forEach(storyBucket => {
    if (!optionsTuples.has(storyBucket.kind)) {
      return;
    }
    const tuplesForKind = optionsTuples.get(storyBucket.kind);
    storyBucket.stories.forEach(story => {
      if (tuplesForKind.has(story.name)) {
        story.options = tuplesForKind.get(story.name);
      }
    });
  });
  if (typeof window === 'object') window[storiesKey] = storybook;
  return storybook;
};
