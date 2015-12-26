import Cycle from '@cycle/core'
import {Observable} from 'rx'
import {makeHTMLDriver} from '@cycle/dom'
import {makeServerHistoryDriver} from '@cycle/history'
import {makeHTTPDriver} from '@cycle/http'
import {App} from '../client/app'
import {wrapVTreeWithHTMLBoilerplate, prependDoctype} from './html-boilerplate'
import winston from 'winston'

function wrapAppResultWithBoilerplate(appFn) {
  return function wrappedAppFn(ext) {
    let requests = appFn(ext)
    let vtree$ = requests.DOM.take(1)
    let wrappedVTree$ = Observable.combineLatest(vtree$,
      wrapVTreeWithHTMLBoilerplate
    )
    return {
      DOM: wrappedVTree$,
      History: requests.History.take(1)
    }
  }
}

export function serveClient() {
  return function* serve(next) {
    let wrappedAppFn = wrapAppResultWithBoilerplate(App)
    let {sources} = Cycle.run(wrappedAppFn, {
      DOM: makeHTMLDriver(),
      History: makeServerHistoryDriver({
        pathname: this.url
      }),
      HTTP: makeHTTPDriver()
    })
    console.log(sources);
    console.log(sources.DOM)
    let html$ = sources.DOM.map(prependDoctype)

    this.body = yield html$.toPromise()
    console.log(this.body)
    yield next
  }
}
