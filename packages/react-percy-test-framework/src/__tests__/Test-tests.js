import React from 'react';
import Test from '../Test';

describe('constructor', () => {
  it('throws when no title or function is specified', () => {
    expect(() => new Test()).toThrow();
  });

  it('throws when no title is specified', () => {
    expect(() => new Test(() => {})).toThrow();
  });

  it('throws when title and options, but no function is specified', () => {
    expect(() => new Test('test', { widths: [320, 1024] })).toThrow();
  });
});

describe('getTestCase', () => {
  it('sets name to title given no parent', async () => {
    const test = new Test('title', () => {});

    const testCase = await test.getTestCase();

    expect(testCase.name).toEqual('title');
  });

  it('sets name to title given parent with no title', async () => {
    const test = new Test('title', () => {});
    test.parent = {
      fullTitle: () => '',
      getOptions: () => [],
    };

    const testCase = await test.getTestCase();

    expect(testCase.name).toEqual('title');
  });

  it('sets name to combined title given parent with title', async () => {
    const test = new Test('title', () => {});
    test.parent = {
      fullTitle: () => 'parent title',
      getOptions: () => [],
    };

    const testCase = await test.getTestCase();

    expect(testCase.name).toEqual('parent title - title');
  });

  it('sets markup to the result of synchronous test function', async () => {
    const markup = <div>Test</div>;
    const test = new Test('title', () => markup);

    const testCase = await test.getTestCase();

    expect(testCase.markup).toEqual(markup);
  });

  it('sets markup to the result of asynchronous test function', async () => {
    const markup = <div>Test</div>;
    const test = new Test(
      'title',
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(markup), 2);
        }),
    );

    const testCase = await test.getTestCase();

    expect(testCase.markup).toEqual(markup);
  });

  it('sets markup to the result of the test function when options are also specified', async () => {
    const markup = <div>Test</div>;
    const test = new Test('title', { widths: [320, 768] }, () => markup);

    const testCase = await test.getTestCase();

    expect(testCase.markup).toEqual(markup);
  });

  it('sets options to an empty empty given no options specified and no parent', async () => {
    const test = new Test('title', () => {});

    const testCase = await test.getTestCase();

    expect(testCase.options).toEqual({});
  });

  it('sets options to parent options given no options specified', async () => {
    const test = new Test('title', () => {});
    test.parent = {
      fullTitle: () => '',
      getOptions: () => ({ widths: [320, 768] }),
    };

    const testCase = await test.getTestCase();

    expect(testCase.options).toEqual({ widths: [320, 768] });
  });

  it('options on test override same options specified on parent', async () => {
    const test = new Test('title', { widths: [375, 1024] }, () => {});
    test.parent = {
      fullTitle: () => '',
      getOptions: () => ({ widths: [320, 768] }),
    };

    const testCase = await test.getTestCase();

    expect(testCase.options).toEqual({ widths: [375, 1024] });
  });

  it('options on test are merged with parent options', async () => {
    const test = new Test('title', { minimumHeight: 300 }, () => {});
    test.parent = {
      fullTitle: () => '',
      getOptions: () => ({ widths: [320, 768] }),
    };

    const testCase = await test.getTestCase();

    expect(testCase.options).toEqual({ minimumHeight: 300, widths: [320, 768] });
  });
});
