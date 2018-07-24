const WebpackStrip = require('webpack-strip');
const isProd = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/index.js',
  output: {
    filename: isProd ? 'kapla.min.js' : 'kapla.js',
    library: 'Kapla',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  mode: isProd ? 'production' : 'development',
  optimization: {
    minimize: isProd,
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};

if (isProd) {
  config.module.rules.push({
    test: /\.js$/,
    use: [
      { loader: WebpackStrip.loader('debug', 'console.info') },
    ],
  });
}

module.exports = config;
