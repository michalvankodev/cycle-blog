import xs from 'xstream'
import {renderHeader} from './header/header'
import {renderFooter} from './footer/footer'
import {div} from '@cycle/dom'
import Home from './pages/home'
import Articles from './pages/articles'
import Admin from './admin'

const routes = {
  '*': Home,
  '/home': Home,
  '/articles': Articles,
  '/admin': Admin
}

function view(children) {
  return div('.app-view', [
    renderHeader(),
    children,
    renderFooter()
  ])
}

export function App(sources) {
  // routing
  const mainRouter$ = sources.router.define(routes)
  const children$ = mainRouter$.map(
    ({path, value}) => value({...sources, router: sources.router.path(path)})
  )
  const vtree$ = children$.map(x => x.DOM).flatten().map(view).debug()
  console.log('App vtree$', vtree$)
  const http$ = children$.map(x => x.HTTP || xs.empty()).flatten()
  // http$.subscribe((request) => {
  //   console.log('app:', request)
  // })

  return {
    DOM: vtree$,
    HTTP: http$
  }
}
