import createDebug from 'debug';

const debug = createDebug('react-percy:api');

export default function createBuild(percyClient, resources) {
  debug('creating build');
  return new Promise((resolve, reject) => {
    percyClient.createBuild({ resources }).then(
      response => {
        debug('created build at %s', response.body.data.attributes['web-url']);
        resolve(response.body.data);
      },
      err => {
        debug('error creating build: %o (%s)', err.error, err.statusCode);
        reject(err);
      },
    );
  });
}
