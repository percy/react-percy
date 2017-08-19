import getSnapshotFiles from '../getSnapshotFiles';

jest.mock('@percy-io/react-percy-webpack', () => ({
  SpecialFiles: {
    foo: '$$special-foo$$',
    bar: '$$special-bar$$',
  },
}));

it('only returns JS assets', () => {
  const assets = {
    '__percy__/Button.percy.js': 'button js code',
    'Button.css': 'button css',
    'icon.jpg': 'icon image',
  };

  const snapshotFiles = getSnapshotFiles(assets);

  expect(snapshotFiles).toEqual([
    {
      path: '__percy__/Button.percy.js',
      src: 'button js code',
    },
  ]);
});

it('does not return special Percy JS files', () => {
  const assets = {
    '$$special-foo$$': 'special foo code',
    '$$special-bar$$': 'special bar code',
    '__percy__/Button.percy.js': 'button js code',
    'Textbox.percy.js': 'textbox js code',
  };

  const snapshotFiles = getSnapshotFiles(assets);

  expect(snapshotFiles).toEqual([
    {
      path: '__percy__/Button.percy.js',
      src: 'button js code',
    },
    {
      path: 'Textbox.percy.js',
      src: 'textbox js code',
    },
  ]);
});
