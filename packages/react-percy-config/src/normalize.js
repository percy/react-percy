import defaults from './defaults';
import path from 'path';

const convertToRegex = pattern => {
  if (typeof pattern === 'string') {
    return new RegExp(pattern);
  }
  return pattern;
};

export default function normalize(config, packageRoot) {
  const normalizedConfig = {};

  normalizedConfig.ignoreRegexes = config.ignoreRegexes
    ? config.ignoreRegexes.map(convertToRegex)
    : defaults.ignoreRegexes;

  normalizedConfig.includeFiles = config.includeFiles || [];

  normalizedConfig.rootDir = config.rootDir ? path.normalize(config.rootDir) : packageRoot;

  normalizedConfig.snapshotIgnorePatterns =
    config.snapshotIgnorePatterns || defaults.snapshotIgnorePatterns;

  normalizedConfig.snapshotPatterns = config.snapshotPatterns || defaults.snapshotPatterns;

  normalizedConfig.snapshotRegex = config.snapshotRegex
    ? convertToRegex(config.snapshotRegex)
    : defaults.snapshotRegex;

  return normalizedConfig;
}
