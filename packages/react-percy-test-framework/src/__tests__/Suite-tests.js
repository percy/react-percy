import Suite from '../Suite';

describe('constructor', () => {
  it('throws when no title is specified', () => {
    expect(() => new Suite()).toThrow();
  });
});

describe('addSuite', () => {
  it('sets parent on suite being added', () => {
    const suite = new Suite('title');
    const nestedSuite = new Suite('nested');

    suite.addSuite(nestedSuite);

    expect(nestedSuite.parent).toEqual(suite);
  });

  it('throws when suite with the same title has already been added', () => {
    const suite = new Suite('parent');

    const nestedSuite1 = new Suite('nested');
    suite.addSuite(nestedSuite1);

    const nestedSuite2 = new Suite('nested');
    expect(() => suite.addSuite(nestedSuite2)).toThrow();
  });
});

describe('addTest', () => {
  it('throws when test with the same title has already been added', () => {
    const suite = new Suite('title');
    suite.parent = new Suite('parent');

    const test1 = { title: 'test' };
    suite.addTest(test1);

    const test2 = { title: 'test' };
    expect(() => suite.addTest(test2)).toThrow();
  });

  it('sets parent on test being added', () => {
    const suite = new Suite('title');
    suite.parent = new Suite('parent');
    const test = { title: 'test' };

    suite.addTest(test);

    expect(test.parent).toEqual(suite);
  });
});

describe('fullTitle', () => {
  it('returns title given no parent', () => {
    const suite = new Suite('title');

    expect(suite.fullTitle()).toEqual('title');
  });

  it('returns title given parent with no title', () => {
    const suite = new Suite('title');
    suite.parent = {
      fullTitle: () => '',
    };

    expect(suite.fullTitle()).toEqual('title');
  });

  it('returns combined title given parent with title', () => {
    const suite = new Suite('title');
    suite.parent = {
      fullTitle: () => 'parent title',
    };

    expect(suite.fullTitle()).toEqual('parent title - title');
  });
});

describe('getOptions', () => {
  it('returns an empty object given no options specified and no parent', () => {
    const suite = new Suite('title');

    expect(suite.getOptions()).toEqual({});
  });

  it('returns parent options given no options specified', () => {
    const suite = new Suite('title');
    suite.parent = {
      getOptions: () => ({ widths: [320, 768] }),
    };

    expect(suite.getOptions()).toEqual({ widths: [320, 768] });
  });

  it('options specified on suite override options on parent', () => {
    const suite = new Suite('title', { widths: [500, 1024] });
    suite.parent = {
      getOptions: () => ({ widths: [320, 768] }),
    };

    expect(suite.getOptions()).toEqual({ widths: [500, 1024] });
  });

  it('merges options on suite with options on parent', () => {
    const suite = new Suite('title', { minimumHeight: 300 });
    suite.parent = {
      getOptions: () => ({ widths: [320, 768] }),
    };

    expect(suite.getOptions()).toEqual({ minimumHeight: 300, widths: [320, 768] });
  });
});
