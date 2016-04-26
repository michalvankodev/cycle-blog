import Cycle from '@cycle/xstream-run'
import xs from 'xstream'
import {makeHTMLDriver} from '@cycle/dom'
import {createServerHistory, makeHistoryDriver} from '@cycle/history'
import {makeHTTPDriver} from '@cycle/http'
import {makeRouterDriver} from 'cyclic-router'
import {App} from '../client/app'
import {wrapVTreeWithHTMLBoilerplate, prependDoctype} from './html-boilerplate'
import toHTML from 'snabbdom-to-html'

function wrapAppResultWithBoilerplate(appFn) {
  return function wrappedAppFn(ext) {
    let requests = appFn(ext)
    let vtree$ = requests.DOM
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
  console.log(history)
  let {sources, sinks, run} = Cycle(wrappedAppFn, {
    DOM: makeHTMLDriver(),
    router: makeRouterDriver(history),
    HTTP: makeHTTPDriver()
  })
  
  console.log('chyba sa stane tu 4')
  history.push(history.createLocation(this.request.url))
  console.log('URL IS ', this.request.url)
  console.log('sources' ,sources, sinks)

  let html$ = sources.DOM.elements
    .do(e => { console.log('before html') ; console.log(e)})
    //.map(toHTML)
    .map(prependDoctype)
    .do(e => console.log(e))

  // this.body = yield new Promise(resolve => 
  //   html$.take(1).t(x => {
  //     console.log('xxxx', x)
  //     dispose()
  //     resolve(x)
  //   })
  // )
  // I need to return promise when I subscribe to HTML stream and then trigger run so it actally happens
  console.log('chyba sa stane tu 5')
  try {
  this.body = yield new Promise(resolve => {
    html$.subscribe(html => {
      console.log('HTML::::', html)
      resolve(html)
    }, error => {console.log(e.message, e)})
    console.log('HTML$::::', html$)

    let dispose = run()
    console.log('dipose', dispose)
  })
} catch(e) {
  console.log(e.message, e)
}
  console.log('chyba sa stane tu 6')
  

  console.log('chyba sa stane tu 7')

  yield next
}
