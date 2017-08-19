import findSnapshotFiles from './findSnapshotFiles';
import merge from 'webpack-merge';
import path from 'path';

export const SpecialFiles = {
  include: '$$percy_include$$',
  render: '$$percy_render$$',
};

export default function configureEntry(webpackConfig, percyConfig) {
  const snapshotFiles = findSnapshotFiles(percyConfig);

  const entry = snapshotFiles.reduce((prev, file) => {
    const entryName = path
      .relative(percyConfig.rootDir, file)
      .replace(new RegExp(`${path.extname(file)}$`), '');
    return {
      ...prev,
      [entryName]: file,
    };
  }, {});

  entry[SpecialFiles.render] = percyConfig.renderer;

  if (percyConfig.includeFiles && percyConfig.includeFiles.length) {
    entry[SpecialFiles.include] = percyConfig.includeFiles;
  }

  return merge.strategy({
    entry: 'replace',
  })(webpackConfig, {
    entry,
  });
}
