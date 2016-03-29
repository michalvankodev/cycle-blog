import {h} from '@cycle/dom'
import {Observable} from 'rx'

export default function Articles({HTTP}) {
  const request$ = Observable.just('http://localhost:8000/api/articles')

  const testValue$ = HTTP.filter(res$ => res$.request.url === 'http://localhost:8000/api/articles')
    .mergeAll()
    .map(res => res.text)
    .catch(() => 'error')
    .startWith('loading ..')

  const vtree$ = testValue$.map(text => h('div', text))
  return {
    DOM: vtree$,
    HTTP: request$
  }
}
