//var paths = require('./build/paths');
var webpack = require('webpack')
var path = require('path')

module.exports = {
  devtool: 'eval',
  entry: ['webpack/hot/dev-server', './src/client'],
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
      {test: /\.css$/, loader: 'style!css'},
      {test: /\.less$/, loader: 'style!css!less'},
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {test: /\.js$/, exclude: /(node_modules)/, loader: 'babel'}
    ]
  }
}
