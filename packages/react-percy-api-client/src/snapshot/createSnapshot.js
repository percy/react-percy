import createDebug from 'debug';

const debug = createDebug('react-percy:api');

export default function createSnapshot(percyClient, build, resources, options) {
  debug('creating snapshot %s', options.name);
  return new Promise((resolve, reject) => {
    percyClient.createSnapshot(build.id, resources, options).then(
      response => {
        debug('created snapshot %s', options.name);
        resolve(response.body.data);
      },
      err => {
        debug('error creating snapshot %s: %s (%s)', options.name, err.error, err.statusCode);
        reject(err);
      },
    );
  });
}
