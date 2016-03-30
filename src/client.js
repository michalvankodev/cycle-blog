let Cycle = require('@cycle/core')
let {makeDOMDriver} = require('@cycle/dom')
let {makeHTTPDriver} = require('@cycle/http')
let {App} = require('./client/app')
import Admin from './client/admin'
import {createHistory} from 'history'
import {makeHistoryDriver, filterLinks} from '@cycle/history'
import {makeRouterDriver} from 'cyclic-router'

// function clientSideApp(responses) {
//   let requests = Admin(responses)
//   return requests
// }

const history = createHistory()
let drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  router: makeRouterDriver(history, {capture: true})
}

Cycle.run(Admin, drivers)

if (module.hot) {
  module.hot.accept()
}
