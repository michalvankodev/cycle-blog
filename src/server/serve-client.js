import Cycle from '@cycle/core'
import {Observable} from 'rx'
import {makeHTMLDriver} from '@cycle/dom'
import {createServerHistory, makeHistoryDriver} from '@cycle/history'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import {App} from '../client/app'
import {wrapVTreeWithHTMLBoilerplate, prependDoctype} from './html-boilerplate'

function wrapAppResultWithBoilerplate(appFn) {
  return function wrappedAppFn(ext) {
    let requests = appFn(ext)
    let vtree$ = requests.DOM.take(1)
    let wrappedVTree$ = Observable.combineLatest(vtree$,
      wrapVTreeWithHTMLBoilerplate
    )
    return {
      DOM: wrappedVTree$,
      HTTP: requests.HTTP
    }
  }
}

export function* serveClient(url = '', next) {
  let wrappedAppFn = wrapAppResultWithBoilerplate(App)
  const history = createServerHistory()
  let {sources} = Cycle.run(wrappedAppFn, {
    DOM: makeHTMLDriver(),
    router: makeRouterDriver(history),
    HTTP: makeHTTPDriver()
  })
  history.push(history.createLocation(this.request.url))
  console.log('URL IS ', this.request.url)
  let html$ = sources.DOM.map(prependDoctype)

  this.body = yield html$.toPromise()
  yield next
}
