import xs from 'xstream'
import {div, ul, li, a} from '@cycle/dom'

function model(response) {
  return {
    total: response.count,
    users: response.results
  }
}

function view({users = [], errorMessage}) {
  if (errorMessage) {
    return div(errorMessage)
  }
  return ul('.users-list', users.map(u => li(u.username)))
}

const errorState = {
  body: {
    response: {
      total: 0,
      users: [],
      errorMessage: 'An error occured'
    }
  }
}

const startState = {
  total: 0,
  users: [],
  errorMessage: 'Loading...'
}

export default function Users(sources) {
  const request$ = xs.of({
    url: '/api/users',
    category: 'users'
  }).remember()

  const {HTTP} = sources
  const response$ = HTTP
    .select('users')
    .flatten()
    .replaceError(() => response$.startWith(errorState))
  const state$ = response$
    .map(r => r.body)
    .map(model)
    .startWith(startState)
  const view$ = state$.map(view)

  return {
    DOM: view$,
    HTTP: request$
  }
}
