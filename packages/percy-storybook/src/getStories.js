// eslint-disable-next-line import/no-unresolved
require('ignore-styles');

require('babel-core/register')({
    ignore: /node_modules\/(?!@bufferapp\/components)/
});

import path from 'path';
import readPkgUp from 'read-pkg-up';
import runWithRequireContext from './require_context';

const storybook = require('@kadira/storybook');

const babel = require('babel-core');
const loadBabelConfig = require('@kadira/storybook/dist/server/babel_config').default;

const pkg = readPkgUp.sync().pkg;
const isStorybook =
  (pkg.devDependencies && pkg.devDependencies['@kadira/storybook']) ||
  (pkg.dependencies && pkg.dependencies['@kadira/storybook']);


export default function getStories() {
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

    return storybook.getStorybook();
}
