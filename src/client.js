let Cycle = require('@cycle/core')
let {makeDOMDriver} = require('@cycle/dom')
let {makeHTTPDriver} = require('@cycle/http')
let {App} = require('./client/app')
import {makeHistoryDriver, filterLinks} from '@cycle/history'

function clientSideApp(responses) {
  let requests = App(responses)
  return requests
}


let drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  History: makeHistoryDriver({
    hash: false, // default, true if your browser doesn't support History API
    queries: true, // default, toggle QuerySupport
    basename: '' // default, sets up BasenameSupport
    // all other history Options
  }),
}

Cycle.run(clientSideApp, drivers)

if (module.hot) {
  module.hot.accept()
}
