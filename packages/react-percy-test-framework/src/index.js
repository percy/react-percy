import * as interfaces from './interfaces';
import Suite from './Suite';

export default function initialize(context) {
  const rootSuite = new Suite('');
  const suites = [rootSuite];
  interfaces.percy(context, suites);
  return rootSuite;
}
