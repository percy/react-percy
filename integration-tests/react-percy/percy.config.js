import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  webpack: {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
          }),
        },
      ],
    },
    plugins: [new ExtractTextPlugin('styles.css')],
  },
};
