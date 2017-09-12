import loadFromPackage from './loadFromPackage';
import normalize from './normalize';
import path from 'path';

export default function readPercyConfig(packageRoot, debug) {
  const packageJsonPath = path.join(packageRoot, 'package.json');
  const config = loadFromPackage(packageJsonPath);
  return normalize(config, packageRoot, debug);
}
