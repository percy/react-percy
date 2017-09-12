import defaults from './defaults';
import path from 'path';

export default function normalize(config, packageRoot, debug = false) {
  const normalizedConfig = {};

  normalizedConfig.debug = debug;

  normalizedConfig.includeFiles = config.includeFiles || [];

  normalizedConfig.renderer = config.renderer || defaults.renderer;

  normalizedConfig.rootDir = config.rootDir ? path.normalize(config.rootDir) : packageRoot;

  normalizedConfig.snapshotIgnorePatterns =
    config.snapshotIgnorePatterns || defaults.snapshotIgnorePatterns;

  normalizedConfig.snapshotPatterns = config.snapshotPatterns || defaults.snapshotPatterns;

  return normalizedConfig;
}
