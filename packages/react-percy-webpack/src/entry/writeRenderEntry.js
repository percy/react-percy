import { GlobalVariables, RootElementId } from './constants';
import escapePathForWindows from './escapePathForWindows';
import fs from 'fs';

export default function writeRenderEntry(percyConfig, filePath, resolver = require.resolve) {
  fs.writeFileSync(
    filePath,
    `
    const url = require("url");
    const renderer = require("${escapePathForWindows(resolver(percyConfig.renderer))}");

    const render = renderer.default || renderer;

    const rootSuite = window["${GlobalVariables.rootSuite}"];

    const parsedUrl = url.parse(window.location.href, true);
    const snapshotName = parsedUrl.query.snapshot;

    const rootEl = document.getElementById("${RootElementId}");

    rootSuite.getSnapshotMarkup(snapshotName)
      .then(function(markup) {
        return render(markup, rootEl);
      });
  `,
  );
}
