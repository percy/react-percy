import createSuite from '@percy-io/react-percy-test-framework';
import { JSDOM } from 'jsdom';

export default class Environment {
  constructor() {
    this.context = {};
    this.rootSuite = createSuite(this.context);
  }

  getSnapshotDefinitions() {
    return this.rootSuite.getSnapshotDefinitions();
  }

  runScript(src) {
    const window = new JSDOM('', { runScripts: 'outside-only' }).window;
    Object.keys(this.context).forEach(key => {
      window[key] = this.context[key];
    });
    window.eval(src);
  }
}
