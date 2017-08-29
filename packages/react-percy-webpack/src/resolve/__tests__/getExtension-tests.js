import getExtension from '../getExtension';

jest.mock('interpret', () => ({
  extensions: {
    '.buble.js': null,
    '.coffee': null,
    '.js': null,
  },
}));

it('returns multipart JS file extension when mapped by interpret', () => {
  const extension = getExtension('webpack.config.buble.js');

  expect(extension).toEqual('.buble.js');
});

it('returns Babel JS when multipart JS file extension not mapped by interpret', () => {
  const extension = getExtension('webpack.config.foo.js');

  expect(extension).toEqual('.babel.js');
});

it('returns custom file extension', () => {
  const extension = getExtension('webpack.config.coffee');

  expect(extension).toEqual('.coffee');
});

it('returns Babel JS given default config name', () => {
  const extension = getExtension('webpack.config.js');

  expect(extension).toEqual('.babel.js');
});
