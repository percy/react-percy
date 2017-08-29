import ApiClient from '@percy-io/react-percy-api-client';
import chalk from 'chalk';
import compileAssets from './compileAssets';
import createDebug from 'debug';
import { EntryNames } from '@percy-io/react-percy-webpack';
import Environment from './Environment';
import findEntryPath from './findEntryPath';
import getHTML from './getHTML';
import getQueryParamsForSnapshot from './getQueryParamsForSnapshot';
import reporter from './reporter';

const debug = createDebug('react-percy:ci');

export default async function run(percyConfig, webpackConfig, percyToken) {
  const client = new ApiClient(percyToken);

  reporter.log('Compiling...');
  debug('compiling assets');
  const assets = await compileAssets(percyConfig, webpackConfig);

  const environment = new Environment();
  const snapshotsEntry = findEntryPath(assets, EntryNames.snapshots);
  debug('executing snapshots script');
  environment.runScript(assets[snapshotsEntry]);

  debug('getting snapshots');
  const snapshots = environment.getSnapshotDefinitions();
  debug('found snapshots %o', snapshots.map(snapshot => snapshot.name));
  if (!snapshots.length) {
    reporter.log(chalk.yellow.bold('No snapshots found'));
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
