import createDebug from 'debug';

const debug = createDebug('react-percy:api');

export default function uploadResources(percyClient, build, resources) {
  debug('uploading resources %o');
  return new Promise((resolve, reject) => {
    percyClient.uploadResources(build.id, resources).then(
      () => {
        debug('uploaded %d resources', resources.length);
        resolve();
      },
      err => {
        debug('error uploading resources: %o (%s)', err.error, err.statusCode);
        reject(err);
      },
    );
  });
}
