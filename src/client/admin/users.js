import {Observable} from 'rx'
import {div, ul, li, a} from '@cycle/dom'

function model(response) {
  return {
    total: response.count,
    users: response.results
  }
}

function view({users = [], errorMessage}) {
  console.log('generating view', arguments)
  if (errorMessage) {
    return div(errorMessage)
  }
  return ul('.users-list', [
    users.map(u => li(u.username))
  ])
}

const errorState = {
  total: 0,
  users: [],
  errorMessage: 'An error occured'
}

const startState = {
  total: 0,
  users: [],
  errorMessage: 'Loading...'
}

export default function Users(sources) {
  console.log('run Users component')
  const request$ = Observable.just({
    url: '/api/users',
    category: 'users'
  })

  const {HTTP} = sources
  const response$ = HTTP
    .filter(res$ => res$.request.category === 'users')
    .switch()
  const state$ = response$
    .map(r => r.body)
    .map(model)
    .catch(() => errorState)
    .startWith(startState)
  const view$ = state$.map(view).share()

  return {
    DOM: view$,
    HTTP: request$.do(x=>console.log('users fetch', x)).share()
  }
}
