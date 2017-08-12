export default {
  ignoreRegexes: [/node_modules/],
  snapshotIgnorePatterns: ['**/node_modules/**'],
  snapshotPatterns: ['**/__percy__/**/*.{js,jsx}', '**/*.percy.{js,jsx}'],
  snapshotRegex: /(\/__percy__\/.*|(\.|\/)(percy))\.jsx?$/,
};
