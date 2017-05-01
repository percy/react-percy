export default async function uploadStories(client, selectedStories, storyHtml, assets) {
    const resources = client.makeResources(assets);
    const build = await client.createBuild(resources);
    const missingResources = client.getMissingResources(build, resources);
    await client.uploadResources(build, missingResources);
    await client.runStories(build, selectedStories, assets, storyHtml);
    await client.finalizeBuild(build);
}
