// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',

    browsers: ['Firefox'],

    preprocessors: {
      'src/**/*.js': ['babel'],
      'src/**/*.spec.js': ['babel']
    },
    'babelPreprocessor': {
      options: {
        sourceMap: 'inline',
        modules: 'system',
        moduleIds: false,
        optional: [
          'es7.decorators'
        ]
      }
    },

    colors: true,

    autoWatch: true,

    singleRun: false
  });
};
