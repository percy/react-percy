export const docs = 'Documentation: https://github.com/percy/react-percy';

export const options = {
  config: {
    alias: 'c',
    description: 'Path to the webpack config file',
  },
  debug: {
    description:
      'Output Percy snapshots to disk for local debugging; no snapshots will be uploaded to Percy',
    default: false,
    type: 'boolean',
  },
};

export const usage = 'Usage: $0 --config=<webpackConfigPath>';
