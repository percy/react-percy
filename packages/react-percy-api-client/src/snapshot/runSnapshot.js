import { getMissingResourceShas, makeRootResource, uploadResources } from '../resources';
import createSnapshot from './createSnapshot';
import finalizeSnapshot from './finalizeSnapshot';

export default async function runSnapshot(percyClient, build, snapshot, html, getQueryParams) {
  try {
    const queryParams = getQueryParams ? getQueryParams(snapshot) : {};
    const encodedQueryParams = Object.keys(queryParams)
      .map(param => `${param}=${encodeURIComponent(queryParams[param])}`)
      .join('&');
    const resource = makeRootResource(percyClient, snapshot.name, html, encodedQueryParams);

    const percySnapshotOptions = {
      name: snapshot.name,
      ...snapshot.options,
    };

    const percySnapshot = await createSnapshot(
      percyClient,
      build,
      [resource],
      percySnapshotOptions,
    );

    const missingResources = getMissingResourceShas(percySnapshot);
    if (missingResources.length > 0) {
      await uploadResources(percyClient, build, [resource]);
    }

    await finalizeSnapshot(percyClient, percySnapshot, snapshot.name);
  } catch (e) {
    e._percy = {
      snapshot,
    };
    throw e;
  }
}
