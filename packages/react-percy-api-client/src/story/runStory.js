import { getMissingResourceShas, makeRootResource, uploadResources } from '../resources';
import createSnapshot from '../snapshot/createSnapshot';
import finalizeSnapshot from '../snapshot/finalizeSnapshot';

export default async function runStory(percyClient, build, story, assets, storyHtml) {
    try {
        const resource = makeRootResource(percyClient, story.name, storyHtml, story.encodedParams);

        let widths = [];
        if (story.sizes) {
            widths = story.sizes.map(size => size.width);
        }

        const snapshotOptions = {
            name: story.name,
            widths,
            enableJavaScript: true
        };

        const snapshot = await createSnapshot(percyClient, build, [resource], snapshotOptions);

        const missingResources = getMissingResourceShas(snapshot);
        if (missingResources.length > 0) {
            await uploadResources(percyClient, build, [resource]);
        }

        await finalizeSnapshot(percyClient, snapshot, story.name);
    } catch (e) {
        e._percy = {
            story
        };
        throw e;
    }

}
