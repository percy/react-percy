import getCommonInterface from '../getCommonInterface';
import Snapshot from '../../Snapshot';
import Suite from '../../Suite';

let suites;
let common;

beforeEach(() => {
  const rootSuite = new Suite('');
  jest.spyOn(rootSuite, 'addBeforeAll');
  jest.spyOn(rootSuite, 'addBeforeEach');
  jest.spyOn(rootSuite, 'addAfterEach');
  jest.spyOn(rootSuite, 'addAfterAll');
  jest.spyOn(rootSuite, 'addSuite');
  jest.spyOn(rootSuite, 'addSnapshot');

  suites = [rootSuite];
  common = getCommonInterface(suites);
});

describe('beforeAll', () => {
  it('adds beforeAll hook to the current suite', () => {
    const hook = jest.fn();

    common.beforeAll(hook);

    expect(suites[0].addBeforeAll).toHaveBeenCalledWith(hook);
  });
});

describe('beforeEach', () => {
  it('adds beforeEach hook to the current suite', () => {
    const hook = jest.fn();

    common.beforeEach(hook);

    expect(suites[0].addBeforeEach).toHaveBeenCalledWith(hook);
  });
});

describe('afterEach', () => {
  it('adds afterEach hook to the current suite', () => {
    const hook = jest.fn();

    common.afterEach(hook);

    expect(suites[0].addAfterEach).toHaveBeenCalledWith(hook);
  });
});

describe('afterAll', () => {
  it('adds afterAll hook to the current suite', () => {
    const hook = jest.fn();

    common.afterAll(hook);

    expect(suites[0].addAfterAll).toHaveBeenCalledWith(hook);
  });
});

describe('suite', () => {
  it('adds the suite as a child of the current suite given no callback', () => {
    common.suite('suite');

    expect(suites[0].addSuite).toHaveBeenCalledWith(expect.any(Suite));
  });

  it('adds the suite as a child of the current suite given callback', () => {
    common.suite('suite', jest.fn());

    expect(suites[0].addSuite).toHaveBeenCalledWith(expect.any(Suite));
  });

  it('returns the new suite given no callback', () => {
    const newSuite = common.suite('suite');

    expect(newSuite).toEqual(expect.any(Suite));
  });

  it('returns the new suite given callback', () => {
    const newSuite = common.suite('suite', jest.fn());

    expect(newSuite).toEqual(expect.any(Suite));
  });

  it('sets the new suite as the current suite while executing callback', () => {
    let callbackCurrentSuite;
    const callback = jest.fn(() => {
      callbackCurrentSuite = suites[0];
    });

    const newSuite = common.suite('suite', callback);

    expect(callbackCurrentSuite).toBe(newSuite);
    expect(callbackCurrentSuite).not.toBe(suites[0]);
  });

  it('restores the current suite after executing callback', () => {
    const currentSuite = suites[0];

    const newSuite = common.suite('suite', jest.fn());

    expect(suites[0]).toBe(currentSuite);
    expect(suites[0]).not.toBe(newSuite);
  });
});

describe('snapshot', () => {
  it('throws if a snapshot with the same name has already been added to the current suite', () => {
    common.snapshot('snapshot', jest.fn());

    expect(() => common.snapshot('snapshot', jest.fn())).toThrow();
  });

  it('does not throw if a snapshot with a different name has already been added to the current suite', () => {
    common.snapshot('snapshot 1', jest.fn());

    expect(() => common.snapshot('snapshot 2', jest.fn())).not.toThrow();
  });

  it('throws if a snapshot with the same name has already been added to a different suite with the same name', () => {
    common.suite('Suite', () => {
      common.snapshot('snapshot', jest.fn());
    });

    expect(() =>
      common.suite('Suite', () => {
        common.snapshot('snapshot', jest.fn());
      }),
    ).toThrowErrorMatchingSnapshot();
  });

  it('does not throw if a snapshot with the same name has already been added to a different suite with a different name', () => {
    common.suite('Suite 1', () => {
      common.snapshot('snapshot', jest.fn());
    });

    expect(() =>
      common.suite('Suite 2', () => {
        common.snapshot('snapshot', jest.fn());
      }),
    ).not.toThrow();
  });

  it('adds snapshot to the current suite', () => {
    common.snapshot('snapshot', jest.fn());

    expect(suites[0].addSnapshot).toHaveBeenCalledWith(expect.any(Snapshot));
  });

  it('returns the new snapshot', () => {
    const newSnapshot = common.snapshot('snapshot', jest.fn());

    expect(newSnapshot).toEqual(expect.any(Snapshot));
  });
});
