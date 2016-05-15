import Cycle from '@cycle/xstream-run'
import xs from 'xstream'
import {makeHTMLDriver} from '@cycle/dom'
import {createServerHistory, makeHistoryDriver} from '@cycle/history'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import App from '../client/app'
import {wrapVTreeWithHTMLBoilerplate, prependDoctype} from './html-boilerplate'
import toHTML from 'snabbdom-to-html'
import config from './config'

function* serveStatic(next) {
  this.body = prependDoctype(toHTML(wrapVTreeWithHTMLBoilerplate([])))
  yield next;
}

function* serveClient(next) {

  let host = this.request.host
  /**
  * Adapts the url if it should be executed on the same server
  * by appending host and port pointing to this koa app
  * @param  {string} url
  * @return {string} url with added information about host
  */
  function adaptUrl(url) {
    if (url.startsWith('/')) {
      return host + url
    }
    return url
  }
  /**
   * Adapt all request that should be executed on this server.
   *
   * Node will try to request for localhost with default port of 80
   * no matter of the port of running koa instance.
   * We need to adapt request that are able to be retrieved from this koa app.
   * We can easily do that by just changing the url of the requests.
   * All other requests to different hosts should stay the same.
   * @param  {@cycle/http.request} request Request object accepted by HTTP sink
   * @return {@cycle/http.request} The same object or object with adapted url
   *  if should the request be processed by this server
   */
  function adaptLocalRequests(request) {
    return {...request, url: adaptUrl(request.url)}
  }

  function wrapAppResultWithBoilerplate(appFn) {
    return function wrappedAppFn(ext) {
      let requests = appFn(ext)
      let vtree$ = requests.DOM
      let wrappedVTree$ = vtree$.map(wrapVTreeWithHTMLBoilerplate)
      let HTTP$ = requests.HTTP.map(adaptLocalRequests).debug()

      return {
        DOM: wrappedVTree$,
        HTTP: HTTP$
      }
    }
  }

  let wrappedAppFn = wrapAppResultWithBoilerplate(App)

  const history = createServerHistory(this.request.url)
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
      error: error => console.log(error.message, error), // TODO RENDER ERROR PAGE
      complete: () => {}
    })
    run()
    history.complete()
  })
  // I need to return promise when I subscribe to HTML stream and then trigger run so it actally happens
  try {
    this.body = yield respond
  } catch (e) {
    console.log(e, e.message, e.stack)
  }
  yield next
}

let serveStrat = config.serverRendering ? serveClient : serveStatic
export default serveStrat
