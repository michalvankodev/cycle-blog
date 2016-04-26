import Cycle from '@cycle/xstream-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import App from './client/app'
import {createHistory} from 'history'
import {makeHistoryDriver, filterLinks} from '@cycle/history'
import {makeRouterDriver} from 'cyclic-router'

import Admin from './client/admin'
import Users from './client/admin/users'
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
