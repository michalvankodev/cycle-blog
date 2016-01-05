import Cycle from '@cycle/core'
import {Observable} from 'rx'
import {makeHTMLDriver} from '@cycle/dom'
import {makeServerHistoryDriver} from '@cycle/history'
import {createLocation} from 'history'
import {makeHTTPDriver} from '@cycle/http'
import {App} from '../client/app'
import {wrapVTreeWithHTMLBoilerplate, prependDoctype} from './html-boilerplate'

function wrapAppResultWithBoilerplate(appFn) {
  return function wrappedAppFn(ext) {
    let requests = appFn(ext)
    let vtree$ = requests.DOM.last()
    let wrappedVTree$ = Observable.combineLatest(vtree$,
      wrapVTreeWithHTMLBoilerplate
    )
    return {
      DOM: wrappedVTree$,
      History: requests.History.take(1),
      HTTP: requests.HTTP
    }
  }
}

export function serveClient() {
  return function* serve(next) {
    let wrappedAppFn = wrapAppResultWithBoilerplate(App)
    let {sources, sinks} = Cycle.run(wrappedAppFn, {
      DOM: makeHTMLDriver(),
      History: makeServerHistoryDriver(createLocation(this.url)),
      HTTP: makeHTTPDriver()
    })
    let html$ = sources.DOM.map(prependDoctype)

    this.body = yield html$.toPromise()
    yield next
  }
}
