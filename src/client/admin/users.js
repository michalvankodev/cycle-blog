import xs from 'xstream'
import {
  div, ul, li, a,
  header, span, h3,
  aside, section
} from '@cycle/dom'
import isolate from '@cycle/isolate'
import UserCard from './user-card'

const initialState = {
  total: 0,
  users: [],
  alternativeMessage: 'Loading...',
  editing: {
    active: false,
    user: null,
    dirty: false
  }
}

// TODO: Reducer
// Why 2 request?
// Editting user
function reducer(state, action) {
  debugger;
  if (!action || !action.type) {
    return state
  }
  switch(action.type) {
    case 'USERS_FETCHED':
      return {
        ...state,
        alternativeMessage: null,
        total: action.value.count,
        users: action.value.results
      }
    default:
      return state
  }
}

function amendStateWithChildren(DOM) {
  return function(state) {
    return {
      ...state,
      users: state.users.map(user => {
        const userCard = isolate(UserCard)({DOM}, user)
        return {
          ...user,
          userCard
        }
      })
    }
  }
}

function view({users = [], alternativeMessage}) {
  if (alternativeMessage) {
    return div(alternativeMessage)
  }
  return ul('.users-list', users.map(u => li({key: u.username}, [
    u.userCard.DOM
  ])))
}

function usersFetched(response) {
  return {
    type: 'USERS_FETCHED',
    value: response
  }
}

export default function Users(sources) {
  console.log('running Users')
  const request$ = xs.of({
    url: '/api/users',
    category: 'users'
  }).remember().debug()

  const {HTTP, DOM} = sources
  const response$ = HTTP
    .select('users')
    .flatten()
    .replaceError(() => response$.startWith(errorState))
    .map(r => r.body)
    .map(usersFetched)

  const state$ = xs.merge(response$)
    .fold(reducer, initialState)
  const amendedState$  = state$.map(amendStateWithChildren(DOM))
  const childrenDOM$$ = amendedState$.map(state => state.users.map(u => u.DOM)).debug()

  const view$ = amendedState$.combine(childrenDOM$$).map(view)

  return {
    DOM: view$,
    HTTP: request$
  }
}
