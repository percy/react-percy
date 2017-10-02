import fs from 'fs';
import 'babel-register';

export default function loadFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const file = require(filePath);
  return file.default || file;
}
