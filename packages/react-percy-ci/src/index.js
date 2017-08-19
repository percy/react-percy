import ApiClient from '@percy-io/react-percy-api-client';
import compileAssets from './compileAssets';
import createDebug from 'debug';
import each from 'promise-each';
import Environment from './Environment';
import getSnapshotFiles from './getSnapshotFiles';
import render from '@percy-io/react-percy-server-render';

const debug = createDebug('react-percy:ci');

export default async function run(percyConfig, webpackConfig, percyToken) {
  const client = new ApiClient(percyToken);

  debug('compiling assets');
  const assets = await compileAssets(percyConfig, webpackConfig);

  const environment = new Environment(percyConfig);
  const snapshotFiles = getSnapshotFiles(assets);
  await each(async snapshotFiles => {
    debug('executing %s', snapshotFiles.path);
    await environment.runScript(snapshotFiles);
  })(snapshotFiles);

  debug('getting snapshots');
  const snapshots = await environment.getSnapshots();
  debug('found %d snapshots', snapshots.length);

  const staticResources = client.makeResources(assets);
  const allResources = [...staticResources];
  const build = await client.createBuild(allResources);

  try {
    const missingResources = client.getMissingResources(build, allResources);
    debug('found missing resources %o', missingResources);
    await client.uploadResources(build, missingResources);
    await client.runSnapshots(build, snapshots, assets, render);
  } finally {
    await client.finalizeBuild(build);
  }
}
