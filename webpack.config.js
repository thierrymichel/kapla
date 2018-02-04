const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: isProd ? 'dist/kapla.min.js' : 'dist/kapla.js',
    library: 'Kapla',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      compress: {
        warnings: false,
        drop_console: true, // eslint-disable-line camelcase
      },
      sourceMap: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};
