import createDebug from 'debug';

const debug = createDebug('react-percy:api');

export default function uploadResource(percyClient, build, resource) {
  debug('uploading resource %s', resource.resourceUrl);
  return new Promise((resolve, reject) => {
    percyClient.uploadResource(build.id, resource.content).then(
      () => {
        debug('uploaded resource %s', resource.resourceUrl);
        resolve();
      },
      err => {
        debug(
          'error uploading resource %s: %s (%s)',
          resource.resourceUrl,
          err.error,
          err.statusCode,
        );
        reject(err);
      },
    );
  });
}
