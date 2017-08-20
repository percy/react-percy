import fs from 'fs';
import { GlobalVariables, RootElementId } from './constants';

export default function writeRenderEntry(percyConfig, filePath, resolver = require.resolve) {
  fs.writeFileSync(
    filePath,
    `
    const renderer = require("${resolver(percyConfig.renderer)}");
    const render = renderer.default || renderer;

    const rootSuite = global["${GlobalVariables.rootSuite}"];
    const snapshotName = global["${GlobalVariables.snapshotName}"];

    const rootEl = document.getElementById("${RootElementId}");

    rootSuite.getSnapshotMarkup(snapshotName)
      .then(markup => render(markup, rootEl));
  `,
  );
}
