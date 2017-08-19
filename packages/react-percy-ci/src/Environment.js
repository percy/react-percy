import createSuite from '@percy-io/react-percy-test-framework';
import { JSDOM } from 'jsdom';

export default class Environment {
  constructor() {
    this.context = {};
    this.rootSuite = createSuite(this.context);
  }

  getSnapshots() {
    return this.rootSuite.getSnapshots();
  }

  async runScript(file) {
    const window = new JSDOM('', { runScripts: 'outside-only' }).window;
    Object.keys(this.context).forEach(key => {
      window[key] = this.context[key];
    });
    await this.context.suite('', () => {
      window.eval(file.src);
    });
  }
}
