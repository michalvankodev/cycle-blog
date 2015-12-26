import {renderHeader} from './header/header'
import {renderFooter} from './footer/footer'
import {div} from '@cycle/dom'
import articles from './pages/articles'
import Rx from 'rx'

function view(drivers) {
  const arts = articles(drivers)

  return arts.DOM.map(routerVTree =>
    div('#app-container', [renderHeader(), routerVTree, renderFooter()])
  )
}

export function App(drivers) {
  const url$ = drivers.DOM.select('a').events('click')
    .map(e => e.target.href)//.filter(filterLinks)

  return {
    DOM: view(drivers),
    History: url$
  }
}
