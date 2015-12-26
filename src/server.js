'use strict';
let Cycle = require('@cycle/core');
let express = require('express');
let {Rx} = Cycle;
let {h, makeHTMLDriver} = require('@cycle/dom');
let {makeHTTPDriver} = require('@cycle/http');
let {main} = require('./app');
import {navigation} from './navigation';

import {makeServerHistoryDriver, filterLinks} from 'cycle-history';


function wrapVTreeWithHTMLBoilerplate(vtree) {
  return h('html', [
    h('head', [
      h('title', 'Cycle Isomorphism Example')
    ]),
    h('body', [
      h('div#app', [vtree]),
      h('script', {src: '/generated/bundle.js'})
    ])
  ]);
}

function prependHTML5Doctype(html) {
  return `<!doctype html>${html}`;
}

function wrapAppResultWithBoilerplate(appFn) {
  return function wrappedAppFn(ext) {
    let {DOM, HTTP, History} = appFn(ext)
    let wrappedVTree$ = DOM.map(wrapVTreeWithHTMLBoilerplate)
    return {
      DOM: wrappedVTree$,
      HTTP: HTTP,
      History: History
    };
  };
}

let server = express();
server.use('/generated', express.static('generated'));
server.use('/api/test/', function(req, res) {
  console.log('APITESTCALL')
  res.send({text: 'teststststststtttt'});
  res.end();
})

server.use(function (req, res) {
  // Ignore favicon requests
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end();
    return;
  }
  console.log(`req: ${req.method} ${req.url}`);

  // let context$ = Rx.Observable.just({route: req.url});
  let wrappedAppFn = wrapAppResultWithBoilerplate(main);
  console.log('asdasd');
  let [requests, responses] = Cycle.run(wrappedAppFn, {
    DOM: makeHTMLDriver({
      'blog-navigation': navigation
    }),
    HTTP: makeHTTPDriver(),
    History: makeServerHistoryDriver({
      pathname: req.url
    })
  });
  let html$ = responses.DOM.map(prependHTML5Doctype);

  html$.subscribe(html => res.send(html));
});

let port = process.env.PORT || 3000;
server.listen(port);
console.log(`Listening on port ${port}`);
