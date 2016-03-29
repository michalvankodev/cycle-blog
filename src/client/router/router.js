import {div} from '@cycle/dom'
import {home} from '../pages/home'
import {articles} from '../pages/articles'
import Admin from '../admin'
import switchPath from 'switch-path'

export default function routerView(sources) {
  let routes = {
    '/': 'home',
    '/home': 'home',
    '/articles': 'articles',
    '/admin': 'admin'
  }

  const value$ = sources.History.map(location => { // History Location Object
    let {value} = switchPath(location.pathname, routes)
    return value
  })

  let routeMappings = {
    home: home,
    articles: articles,
    admin: Admin
  }

  const view$ = value$.map(value =>
    div('.router-view', routeMappings[value](sources).DOM)
  )
  const http$ = value$.map(value => routeMappings[value](sources).HTTP)
  return {
    DOM: view$,
    HTTP: http$
  }
}
