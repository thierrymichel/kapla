const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const isProd = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.js',
  output: {
    filename: isProd ? 'kapla.min.js' : 'kapla.js',
    library: 'kapla',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  mode: isProd ? 'production' : 'development',
  optimization: {
    minimize: isProd,
  },
  // DEV
  // resolve: {
  //   mainFields: ['module', 'browser', 'main'],
  // },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '../report.html',
    }),
  ],
};

// DEV
// if (isProd) {
//   config.module.rules
//     .find(rule => rule.use.loader === 'babel-loader')
//     .use.options.plugins.push('transform-remove-console');
// }

module.exports = config;
