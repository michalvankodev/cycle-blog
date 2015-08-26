// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
var webpackConfig = require('./webpack.config');

var webpackKarmaConf = {};

webpackKarmaConf.node = {
  fs: 'empty'
};

webpackKarmaConf.module = webpackConfig.module;

module.exports = function(config) {
  config.set({
    basePath: '',

    plugins: [
      'karma-webpack',
      'karma-tap',
      'karma-firefox-launcher',
      'karma-nyan-reporter'
    ],

    frameworks: ['tap'],

    browsers: ['Firefox'],

    files: ['src/**/*.spec.js'],

    preprocessors: {
      'src/**/*.spec.js': ['webpack']
    },

    webpack: webpackKarmaConf,

    webpackMiddleware: {
        // webpack-dev-middleware configuration
        // i. e.
        noInfo: true
    },

    reporters: ['nyan'],

    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    client: {
        captureConsole: false
    },

    singleRun: false
  });
};
