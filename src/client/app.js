import {renderHeader} from './header/header'
import {renderFooter} from './footer/footer'
import {div} from '@cycle/dom'
import articles from './pages/articles'

export function App(sources) {
  // routing
  const url$ = sources.DOM.select('a').events('click')
    .map(e => e.target.href)//.filter(filterLinks)

  const arts = articles(sources)

  const vtree$ = arts.DOM.map(routerVTree =>
    div('#app-container', [renderHeader(), routerVTree, renderFooter()])
  )

  const http$ = arts.HTTP

  // http$.subscribe((request) => {
  //   console.log(request)
  // })

  return {
    DOM: vtree$,
    History: url$,
    HTTP: http$
  }
}
