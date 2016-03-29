let Cycle = require('@cycle/core')
let {makeDOMDriver} = require('@cycle/dom')
let {makeHTTPDriver} = require('@cycle/http')
let {App} = require('./client/app')
import {createHistory} from 'history'
import {makeHistoryDriver, filterLinks} from '@cycle/history'
import {makeRouterDriver} from 'cyclic-router'

function clientSideApp(responses) {
  let requests = App(responses)
  return requests
}

const history = createHistory()
let drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  router: makeRouterDriver(history, {capture: true})
}

Cycle.run(clientSideApp, drivers)

if (module.hot) {
  module.hot.accept()
}
