import glob from 'glob';
import path from 'path';

export default function findSnapshotFiles(percyConfig) {
  const snapshotFiles = new Set();
  percyConfig.snapshotPatterns.forEach(pattern => {
    glob
      .sync(pattern, {
        absolute: true,
        cwd: percyConfig.rootDir,
        ignore: percyConfig.snapshotIgnorePatterns,
      })
      .forEach(file => snapshotFiles.add(path.normalize(file)));
  });
  return Array.from(snapshotFiles);
}
