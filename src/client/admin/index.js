import xs from 'xstream'
import {div, section, aside, h4, ul, li, a} from '@cycle/dom'
import {partial} from 'ramda'
import Users from './users'
import Posts from './posts'

export function AdminIndex(sources) {
  return {
    DOM: xs.of(div('Welcome peasent'))
  }
}

const routes = {
  '*': AdminIndex,
  '/users': Users,
  '/posts': Posts
}

function sidebarItem(createHref, {path, name}) {
  return li('.admin-nav-item', [
    a(
      {props: {
        href: createHref(path)
      }},
      name
    )
  ])
}

function sidebar(createHref) {
  return aside('.admin-sidebar', [
    h4('Administration'),
    ul('.admin-side-nav', [
      sidebarItem(createHref, {path: '/', name: 'Index'}),
      sidebarItem(createHref, {path: '/users', name: 'Users'}),
      sidebarItem(createHref, {path: '/posts', name: 'Posts'})
    ])
  ])
}

function view(createHref, children) {
  return section('.admin-index-page', [
    sidebar(createHref),
    children
  ])
}

export default function Admin(sources) {
  const {router} = sources
  const match$ = router.define(routes)
  const children$ = match$.map(
    ({path, value}) => value({...sources, router: sources.router.path(path)})
  ).remember()
  const createView = partial(view, [::router.createHref])
  const vtree$ = children$.map(x => x.DOM).flatten().map(createView)
  const http$ = children$.map(x => x.HTTP || xs.empty())
    .flatten()
  return {
    DOM: vtree$,
    HTTP: http$
  }
}
