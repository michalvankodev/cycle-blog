//var paths = require('./build/paths');
var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  entry: ['webpack/hot/dev-server', './src/app'],
  output: {
      path: path.join(__dirname, 'generated'),
      filename: 'bundle.js',
      publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.js$/, exclude: /(node_modules)/, loader: 'babel', query: { stage: 0 } }
    ]
  }
};
