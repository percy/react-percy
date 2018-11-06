import ApiClient from '@percy/react-percy-api-client';
import chalk from 'chalk';
import { compile } from '@percy/react-percy-webpack';
import createDebug from 'debug';
import { EntryNames } from '@percy/react-percy-webpack';
import Environment from './Environment';
import findEntryPath from './findEntryPath';
import fs from 'fs';
import getHTML from './getHTML';
import getQueryParamsForSnapshot from './getQueryParamsForSnapshot';
import path from 'path';
import reporter from './reporter';

const debug = createDebug('react-percy:ci');

export default async function run(percyConfig, percyToken) {
  const client = new ApiClient(percyToken);

  if (percyConfig.debug) {
    reporter.log(chalk.blue.bold('DEBUG MODE: No snapshots will be uploaded to Percy'));
  }

  reporter.log('Compiling...');
  debug('compiling assets');
  const assets = await compile(percyConfig);

  const environment = new Environment();
  const runtimeEntry = findEntryPath(assets, EntryNames.runtime);
  const vendorEntry = findEntryPath(assets, EntryNames.vendor);
  const snapshotsEntry = findEntryPath(assets, EntryNames.snapshots);
  debug('executing scripts');
  environment.runScript(`
    ${assets[runtimeEntry]}
    ${assets[vendorEntry]}
    ${assets[snapshotsEntry]}
  `);

  debug('getting snapshots');
  const snapshots = environment.getSnapshotDefinitions();
  debug('found snapshots %o', snapshots.map(snapshot => snapshot.name));
  if (!snapshots.length) {
    reporter.log(chalk.yellow.bold('No snapshots found'));
    return;
  }

  if (percyConfig.debug) {
    const html = getHTML(assets);
    const htmlPath = path.join(percyConfig.rootDir, '.percy-debug', 'index.html');
    fs.writeFileSync(htmlPath, html);
    reporter.log(
      'Debug snapshots by opening %s in your browser and appending the following query strings:',
      chalk.blue.underline(`file://${htmlPath}`),
    );
    snapshots.sort().forEach(snapshot => {
      reporter.log(
        `  %s    ${chalk.green('?snapshot=%s')}`,
        snapshot.name,
        encodeURIComponent(snapshot.name),
      );
    });
    return;
  }

  reporter.log(
    'Uploading %d snapshot%s to Percy',
    snapshots.length,
    snapshots.length > 1 ? 's' : '',
  );
  const resources = client.makeResources(assets);
  const build = await client.createBuild(resources);

  try {
    const missingResources = client.getMissingResources(build, resources);
    debug('found missing resources %o', missingResources.map(resource => resource.resourceUrl));
    await client.uploadResources(build, missingResources);

    const html = getHTML(assets);
    await client.runSnapshots(build, snapshots, html, getQueryParamsForSnapshot);
  } finally {
    await client.finalizeBuild(build);
  }

  reporter.log('Visual diffs are now processing at %s', build.attributes['web-url']);
}
