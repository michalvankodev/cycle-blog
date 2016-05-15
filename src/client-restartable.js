import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import {createHistory} from 'history'
import {makeHistoryDriver, filterLinks} from '@cycle/history'
import {makeRouterDriver} from 'cyclic-router'
import App from './client/app'

const history = createHistory()
let drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  router: makeRouterDriver(history, {capture: true})
}

Cycle.run(App, drivers)

if (module.hot) {
  module.hot.accept()
}
