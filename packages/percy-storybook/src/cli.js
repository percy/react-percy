// eslint-disable-next-line import/no-unresolved
require('ignore-styles');

require('babel-core/register')({
    ignore: /node_modules\/(?!@bufferapp\/components)/
});

import ApiClient from 'react-percy-api-client';

import path from 'path';
import readPkgUp from 'read-pkg-up';
import createDebug from 'debug';
import runWithRequireContext from './require_context';

const storybook = require('@kadira/storybook');

const fs = require('fs');
const babel = require('babel-core');
const loadBabelConfig = require('@kadira/storybook/dist/server/babel_config').default;

const debug = createDebug('percy-storybook');

const pkg = readPkgUp.sync().pkg;
const isStorybook =
  (pkg.devDependencies && pkg.devDependencies['@kadira/storybook']) ||
  (pkg.dependencies && pkg.dependencies['@kadira/storybook']);

// eslint-disable-next-line import/prefer-default-export
export async function run() {
    if (isStorybook) {
        const configDirPath = path.resolve('.storybook');
        const configPath = path.join(configDirPath, 'config.js');

        const babelConfig = loadBabelConfig(configDirPath);

        const content = babel.transformFileSync(configPath, babelConfig).code;

        const contextOpts = {
            filename: configPath,
            dirname: configDirPath
        };

        runWithRequireContext(content, contextOpts);
    } else {
        throw new Error(
          'percy-storybook is intended only to be used with react storybook',
        );
    }

    const percyToken = process.env.PERCY_TOKEN;


    const storybookStaticPath = path.resolve('storybook-static');
    const storyHtml = fs.readFileSync(path.join(storybookStaticPath, 'iframe.html'), 'utf8');
    const storybookJavascriptPath = storyHtml.match(/<script src="(.*?)"><\/script>/)[1];
    const storyJavascript = fs.readFileSync(path.join(storybookStaticPath, storybookJavascriptPath), 'utf8');

    const stories = storybook.getStorybook();
    debug('stories %o', stories);

    const selectedStories = [];
    for (const group of stories) {
        for (const story of group.stories) {
            const name = `${group.kind}: ${story.name}`;
            const encodedParams = `selectedKind=${encodeURIComponent(group.kind)}` +
                `&selectedStory=${encodeURIComponent(story.name)}`;

            selectedStories.push({
                name,
                encodedParams,
                sizes: []
            });
        }
    }

    debug('selectedStories %o', selectedStories);

    const apiUrl = process.env.PERCY_API;
    const client = new ApiClient(percyToken, apiUrl);
    const assets = {};
    assets[storybookJavascriptPath] = storyJavascript;

    debug('assets %o', assets);

    const resources = client.makeResources(assets);
    debug('resources %o', resources);
    const build = await client.createBuild(resources);
    const missingResources = client.getMissingResources(build, resources);
    debug('found missing resources %o', missingResources);
    await client.uploadResources(build, missingResources);
    await client.runStories(build, selectedStories, assets, storyHtml);
    await client.finalizeBuild(build);
}
