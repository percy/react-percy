import defaults from './defaults';
import getWebpackSettings from './getWebpackSettings';
import path from 'path';

export default function normalize(config, packageRoot, configPath, debug = false) {
  const normalizedConfig = {};

  normalizedConfig.debug = debug;

  normalizedConfig.includeFiles = config.includeFiles || [];

  normalizedConfig.renderer = config.renderer || defaults.renderer;

  normalizedConfig.rootDir = config.rootDir ? path.normalize(config.rootDir) : packageRoot;

  normalizedConfig.snapshotIgnorePatterns =
    config.snapshotIgnorePatterns || defaults.snapshotIgnorePatterns;

  normalizedConfig.snapshotPatterns = config.snapshotPatterns || defaults.snapshotPatterns;

  normalizedConfig.webpack = getWebpackSettings(
    config.webpack,
    normalizedConfig.rootDir,
    configPath,
  );

  return normalizedConfig;
}
