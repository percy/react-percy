import path from 'path';
import { SpecialFiles } from '@percy-io/react-percy-webpack';

const SpecialFileNames = new Set(Object.keys(SpecialFiles));

export default function getSnapshotFiles(assets) {
  return Object.keys(assets)
    .filter(name => /\.js$/.test(name))
    .filter(name => !SpecialFileNames.has(path.basename(name, '.js')))
    .map(name => ({
      path: name,
      src: assets[name],
    }));
}
