import xs from 'xstream'
import {
  div, header, section,
  span, h3, aside
} from '@cycle/dom'

function editUserAction(e) {
  return {
    type: 'editUser'
  }
}

function deleteUserAction(e) {
  return {
    type: 'deleteUser'
  }
}

function reducer(state, action) {
  return state
}

function view({user}) {
  return div('.user-card', [
    header([
      span([
        h3(user.username)
      ]),
      span('.edit-user', 'edit'),
      span('.detele-user', 'delete')
    ]),
    section('.user-small-profile', [
      aside([
        span('profilepic')
      ]),
      div('.user-info', [
        span('role:'),
        span('posts:'),
        span('comments:')
      ])
    ])
  ])
}

export default function UserCard({DOM}, user) {
  // intent
  const edit$ = DOM.select('.edit-user').events('click')
    .map(editUserAction)
  const delete$ = DOM.select('.delete-user').events('click')
    .map(deleteUserAction)
  
  const state$ = xs.merge(edit$, delete$)
    .fold(reducer, user)
  const view$ = state$.map(view)
  
  return {
    DOM: view$,
    HTTP: xs.empty()
  }
}
