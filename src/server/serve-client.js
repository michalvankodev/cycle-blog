import Cycle from '@cycle/xstream-run'
import xs from 'xstream'
import {makeHTMLDriver} from '@cycle/dom'
import {createServerHistory, makeHistoryDriver} from '@cycle/history'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import App from '../client/app'
import {wrapVTreeWithHTMLBoilerplate, prependDoctype} from './html-boilerplate'
import toHTML from 'snabbdom-to-html'

function wrapAppResultWithBoilerplate(appFn) {
  return function wrappedAppFn(ext) {
    let requests = appFn(ext)
    let vtree$ = requests.DOM
    let wrappedVTree$ = vtree$.map(wrapVTreeWithHTMLBoilerplate).debug()
    let HTTP$ = requests.HTTP.debug()

    return {
      DOM: wrappedVTree$,
      HTTP: HTTP$
    }
  }
}

export function* serveClient(next) {
  let wrappedAppFn = wrapAppResultWithBoilerplate(App)

  const history = createServerHistory()
  let {sources, sinks, run} = Cycle(wrappedAppFn, {
    DOM: makeHTMLDriver(),
    router: makeRouterDriver(history),
    HTTP: makeHTTPDriver()
  })

  let html$ = sources.DOM.elements
    .map(prependDoctype)

  const respond = new Promise((resolve, reject) => {
    html$.addListener({
      next: html => resolve(html),
      error: error => console.log(error.message, error),
      complete: () => console.log('FINAL HTML STREAM COMPLETED'),
    })
    sources.router.history$.addListener({
      next: event => {
        console.log('children next', event)
        sources.router.history$.shamefullySendComplete()
      },
      error: error => console.log(error.message, error),
      complete: () => console.log('CHILDREN STREAM COMPLETED'),
    })

    run()
    history.push(history.createLocation(this.request.url))
  })
  // I need to return promise when I subscribe to HTML stream and then trigger run so it actally happens
  try {
    this.body = yield respond
  } catch (e) {
    console.log(e, e.message, e.stack)
  }
  yield next
}
