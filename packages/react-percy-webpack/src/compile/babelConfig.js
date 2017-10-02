export default {
  presets: [
    [
      // Support ES2015, ES2016, ES2017 syntax
      require.resolve('babel-preset-env'),
      {
        targets: {
          node: 4,
          browsers: ['last 2 versions', 'Firefox >= 45'],
        },
      },
    ],

    // Support experimental new JS features
    require.resolve('babel-preset-stage-0'),

    // Support JSX and Flow
    require.resolve('babel-preset-react'),
  ],
  plugins: [
    // Support async/await
    require.resolve('babel-plugin-transform-regenerator'),

    // Support dynamic imports
    require.resolve('babel-plugin-syntax-dynamic-import'),

    // Provide polyfills
    [
      require.resolve('babel-plugin-transform-runtime'),
      {
        helpers: true,
        polyfill: true,
        regenerator: true,
      },
    ],

    // Automatically import React in files with JSX
    require.resolve('babel-plugin-react-require'),
  ],
};
