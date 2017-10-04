export default {
  renderer: '@percy/react-percy-snapshot-render',
  snapshotIgnorePatterns: ['**/node_modules/**'],
  snapshotPatterns: ['**/__percy__/**/*.{js,jsx}', '**/*.percy.{js,jsx}'],
};
