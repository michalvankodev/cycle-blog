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
    let vtree$ = requests.DOM.take(1)
    console.log('chyba sa stane tu 1')
    let wrappedVTree$ = vtree$.map(wrapVTreeWithHTMLBoilerplate)
    console.log('chyba sa stane tu 2')
    return {
      DOM: wrappedVTree$,
      HTTP: requests.HTTP
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

  console.log('chyba sa stane tu 4')
  console.log('URL IS ', this.request.url)
  console.log('sources' ,sources, sinks)

  let html$ = sources.DOM.elements
    .map(prependDoctype)

  const respond = new Promise((resolve, reject) => {
    let dispose = run()
    history.push(history.createLocation(this.request.url))
    html$.take(1).addListener({
      next: html => resolve(html),
      error: error => console.log(error.message, error)
    })
  })
  // I need to return promise when I subscribe to HTML stream and then trigger run so it actally happens
  try {
    this.body = yield respond
  } catch (e) {
    console.log(e, e.message, e.stack)
  }
  console.log('chyba sa stane tu 6')
  yield next
}
