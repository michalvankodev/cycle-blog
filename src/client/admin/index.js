import {Observable} from 'rx'
import {div, section, aside, h4, ul, li, a} from '@cycle/dom'
import {partial} from 'ramda'
import Users from './users'
import Posts from './posts'

export function AdminIndex(sources) {
  return {
    DOM: Observable.just(div('Welcome peasent'))
  }
}

const routes = {
  '*': AdminIndex,
  '/users': Users,
  '/posts': Posts
}

function sidebarItem(createHref, {path, name}) {
  return li('.admin-nav-item', [
    a({href: createHref(path)}, name)
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
  const match$ = router.define(routes).do(x => console.log('tellme', x))
  const children$ = match$.map(
    ({path, value}) => value({...sources, router: sources.router.path(path)})
  ).share()
  const createView = partial(view, [router.createHref])
  const vtree$ = children$.map(ch => ch.DOM).switch().map(createView)
  const http$ = children$.map(x => x.HTTP)
    .do(x=>console.log('allhttp fetch', x))
    .filter(x => !!x).mergeAll()
  return {
    DOM: vtree$,
    HTTP: http$.do(x=>console.log('admin fetch', x))
  }
}
