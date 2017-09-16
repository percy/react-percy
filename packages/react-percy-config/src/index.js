import loadFile from './loadFile';
import normalize from './normalize';
import path from 'path';

export default function readPercyConfig(packageRoot, debug) {
  const configPath = path.join(packageRoot, 'percy.config.js');
  const config = loadFile(configPath);
  return normalize(config, packageRoot, configPath, debug);
}
