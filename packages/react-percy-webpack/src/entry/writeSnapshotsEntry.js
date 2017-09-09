import escapePathForWindows from './escapePathForWindows';
import fs from 'fs';

const getSuiteForFile = file =>
  `global.suite('', function () { require(${escapePathForWindows(JSON.stringify(file))}); });`;

export default function writeSnapshotsEntry(snapshotFiles, filePath) {
  fs.writeFileSync(filePath, snapshotFiles.map(getSuiteForFile).join('\n'));
}
