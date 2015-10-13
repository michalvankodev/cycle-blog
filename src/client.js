let Cycle = require('@cycle/core');
let {makeDOMDriver} = require('@cycle/dom');
let {makeHTTPDriver} = require('@cycle/http');
let {main} = require('./app');
import {makeHistoryDriver, filterLinks} from 'cycle-history';
import {navigation} from './navigation';
function clientSideApp(responses) {
  let requests = main(responses);
  requests.DOM = requests.DOM.skip(1);
  return requests;
}


let drivers = {
  DOM: makeDOMDriver('#app', {
    'blog-navigation': navigation
  }),
  History: makeHistoryDriver({
    hash: false, // default, true if your browser doesn't support History API
    queries: true, // default, toggle QuerySupport
    basename: '' // default, sets up BasenameSupport
    // all other history Options
  }),
  HTTP: makeHTTPDriver()
};

Cycle.run(clientSideApp, drivers);
