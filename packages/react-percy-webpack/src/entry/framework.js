import createSuite from '@percy/react-percy-test-framework';
import { GlobalVariables } from './constants';

global[GlobalVariables.rootSuite] = createSuite(global);
