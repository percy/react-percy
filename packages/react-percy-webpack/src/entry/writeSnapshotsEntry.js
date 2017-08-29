import fs from 'fs';

const getSuiteForFile = file =>
  `global.suite('', function () { require(${JSON.stringify(file)}); });`;

export default function writeSnapshotsEntry(snapshotFiles, filePath) {
  fs.writeFileSync(filePath, snapshotFiles.map(getSuiteForFile).join('\n'));
}
