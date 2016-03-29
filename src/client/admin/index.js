import {Observable} from 'rx'
import {div, section, aside, h4, ul, li} from '@cycle/dom'
import Users from './users'

export function AdminIndex(sources) {
  return {
    DOM: Observable.just(div('Welcome peasent'))
  }
}

const routes = {
  '/': AdminIndex,
  '/users': Users
}

const sidebar = aside('.admin-sidebar', [
  h4('Administration'),
  ul('.admin-side-nav', [
    li('yep')
  ])
])

function view(children) {
  return section('.admin-index-page', [
    sidebar,
    children
  ])
}

export default function Admin(sources) {
  const {router} = sources
  const match$ = router.define(routes)
  const children$ = match$.map(
    ({path, value}) => value({...sources, router: router.path(path)})
  )
  const vtree$ = children$.map(ch => ch.DOM).map(view)
  return {
    DOM: vtree$
  }
}
