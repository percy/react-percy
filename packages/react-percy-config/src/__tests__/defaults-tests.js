import defaults from '../defaults';
import micromatch from 'micromatch';

const expectFileToMatchPatterns = (file, patterns) => {
  const matches = micromatch([file], patterns);
  expect(matches).toEqual([file]);
};

const expectFileNotToMatchPatterns = (file, patterns) => {
  const matches = micromatch([file], patterns);
  expect(matches).toEqual([]);
};

describe('snapshotIgnorePatterns', () => {
  it('matches JS files in top-level `node_modules` directory', () => {
    expectFileToMatchPatterns('/node_modules/foo.js', defaults.snapshotIgnorePatterns);
  });

  it('matches JSX files in top-level `node_modules` directory', () => {
    expectFileToMatchPatterns('/node_modules/foo.jsx', defaults.snapshotIgnorePatterns);
  });

  it('matches non-JS files in top-level `node_modules` directory', () => {
    expectFileToMatchPatterns('/node_modules/foo.json', defaults.snapshotIgnorePatterns);
  });

  it('matches JS files nested within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns('/node_modules/package/foo.js', defaults.snapshotIgnorePatterns);
  });

  it('matches JSX files nested within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns('/node_modules/package/foo.jsx', defaults.snapshotIgnorePatterns);
  });

  it('matches non-JS files nested within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns('/node_modules/package/foo.json', defaults.snapshotIgnorePatterns);
  });

  it('matches JS files nested within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/foo.js',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JSX files nested within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/foo.jsx',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches non-JS files nested within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/foo.json',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JS files in `__percy__` directories within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/node_modules/package/__percy__/foo.js',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JSX files in `__percy__` directories within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/node_modules/package/__percy__/foo.jsx',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches non-JS files in `__percy__` directories within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/node_modules/package/__percy__/foo.json',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JS files in `__percy__` directories within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      'packages/foo/node_modules/package/__percy__/foo.js',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JSX files in `__percy__` directories within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/__percy__/foo.jsx',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches non-JS files in `__percy__` directories within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/__percy__/foo.json',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JS files with `.percy` suffix within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/node_modules/package/foo.percy.js',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JSX files with `.percy` suffix within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/node_modules/package/foo.percy.jsx',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches non-JS files with `.percy` suffix within top-level `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/node_modules/package/foo.percy.json',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JS files with `.percy` suffix within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/foo.percy.js',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches JSX files with `.percy` suffix within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/foo.percy.jsx',
      defaults.snapshotIgnorePatterns,
    );
  });

  it('matches non-JS files with `.percy` suffix within nested `node_modules` directory', () => {
    expectFileToMatchPatterns(
      '/packages/foo/node_modules/package/foo.percy.json',
      defaults.snapshotIgnorePatterns,
    );
  });
});

describe('snapshotPatterns', () => {
  it('matches JS files in `__percy__` directories', () => {
    expectFileToMatchPatterns('/package/src/__percy__/foo.js', defaults.snapshotPatterns);
  });

  it('matches JSX files in `__percy__` directories', () => {
    expectFileToMatchPatterns('/package/src/__percy__/foo.jsx', defaults.snapshotPatterns);
  });

  it('does not match non-JS files in `__percy__` directories', () => {
    expectFileNotToMatchPatterns('/package/src/__percy__/foo.json', defaults.snapshotPatterns);
  });

  it('matches JS files with `.percy` suffix', () => {
    expectFileToMatchPatterns('/package/src/foo/foo.percy.js', defaults.snapshotPatterns);
  });

  it('matches JSX files with `.percy` suffix', () => {
    expectFileToMatchPatterns('/package/src/foo/foo.percy.jsx', defaults.snapshotPatterns);
  });

  it('does not match non-JS files with `.percy` suffix', () => {
    expectFileNotToMatchPatterns('/package/src/foo/foo.percy.json', defaults.snapshotPatterns);
  });

  it('does not match other JS files', () => {
    expectFileNotToMatchPatterns('/package/src/foo/foo.js', defaults.snapshotPatterns);
  });

  it('does not match other JSX files', () => {
    expectFileNotToMatchPatterns('/package/src/foo/foo.jsx', defaults.snapshotPatterns);
  });
});

describe('snapshotRegex', () => {
  it('matches JS files in `__percy__` directories', () => {
    expect('/package/src/__percy__/foo.js').toMatch(defaults.snapshotRegex);
  });

  it('matches JSX files in `__percy__` directories', () => {
    expect('/package/src/__percy__/foo.jsx').toMatch(defaults.snapshotRegex);
  });

  it('does not match non-JS files in `__percy__` directories', () => {
    expect('/package/src/__percy__/foo.json').not.toMatch(defaults.snapshotRegex);
  });

  it('matches JS files with `.percy` suffix', () => {
    expect('/package/src/foo/foo.percy.js').toMatch(defaults.snapshotRegex);
  });

  it('matches JSX files with `.percy` suffix', () => {
    expect('/package/src/foo/foo.percy.jsx').toMatch(defaults.snapshotRegex);
  });

  it('does not match non-JS files with `.percy` suffix', () => {
    expect('/package/src/foo/foo.percy.json').not.toMatch(defaults.snapshotRegex);
  });

  it('does not match other JS files', () => {
    expect('/package/src/foo/foo.js').not.toMatch(defaults.snapshotRegex);
  });

  it('does not match other JSX files', () => {
    expect('/package/src/foo/foo.jsx').not.toMatch(defaults.snapshotRegex);
  });
});
