import {renderHeader} from './header/header'
import {renderFooter} from './footer/footer'
import {div} from '@cycle/dom'
import router from './router/router'
import {Observable} from 'rx'

export function App(sources) {
  // routing
  const url$ = sources.DOM.select('a').events('click')
    .map(e => e.target.href)//.filter(filterLinks)

  const mainRouter = router(sources)

  const vtree$ = mainRouter.DOM.map(routerVTree =>
    div('#app-container', [renderHeader(), routerVTree, renderFooter()])
  )

  const http$ = Observable.just({})

  // http$.subscribe((request) => {
  //   console.log(request)
  // })

  return {
    DOM: vtree$,
    History: url$,
    HTTP: http$
  }
}
