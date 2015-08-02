let source = 'src/';
let output = 'dist/';
let generated = 'generated/';

export default {
  root: source,
  generated: generated,
  jsBundle: generated + 'bundle.js',
  js: source + '**/!(*.spec).js',
  entries: source + 'app.js',
  spec: source + '**/*.spec.js',
  html: source + '**/*.html',
  less: source + '**/*.less',
  output: output,
  indexHtml: './index.html',
  karmaConf : '/../../karma.conf.js'
};
