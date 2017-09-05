import createDebug from 'debug';

const debug = createDebug('react-percy:api');

export default function finalizeSnapshot(percyClient, snapshot, name) {
  debug('finalizing snapshot %s', name);
  return new Promise((resolve, reject) => {
    percyClient.finalizeSnapshot(snapshot.id).then(
      () => {
        debug('finalized snapshot %s', name);
        resolve();
      },
      err => {
        debug('error finalizing snapshot %s: %s (%s)', name, err.error, err.statusCode);
        reject(err);
      },
    );
  });
}
