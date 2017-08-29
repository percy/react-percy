export default function detectWebpackVersion() {
  const packageJson = require('webpack/package.json');
  return parseInt(packageJson.version.split('.')[0]);
}
