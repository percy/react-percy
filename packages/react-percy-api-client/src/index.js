import { createBuild, finalizeBuild } from './build';
import { getMissingResources, makeResources, uploadResources } from './resources';
import PercyClient from 'percy-client';
import { runSnapshots } from './snapshot';
import { runStories } from './story';

export default class PercyApiClient {

    constructor(token, apiUrl) {
        this._client = new PercyClient({
            token,
            apiUrl
        });
    }

    createBuild(resources) {
        return createBuild(this._client, resources);
    }

    finalizeBuild(build) {
        return finalizeBuild(this._client, build);
    }

    getMissingResources(build, resources) {
        return getMissingResources(build, resources);
    }

    makeResources(assets) {
        return makeResources(this._client, assets);
    }

    runSnapshots(build, testCases, assets, renderer) {
        return runSnapshots(this._client, build, testCases, assets, renderer);
    }

    runStories(build, stories, widths, assets, storyHtml) {
        return runStories(this._client, build, stories, widths, assets, storyHtml);
    }

    uploadResources(build, resources) {
        return uploadResources(this._client, build, resources);
    }

}
