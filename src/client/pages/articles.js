import {h} from '@cycle/dom'
import xs from 'xstream'

export default function Articles({HTTP}) {
  const request$ = xs.of('http://localhost:8000/api/articles')

  const testValue$ = HTTP.filter(res$ => res$.request.url === 'http://localhost:8000/api/articles')
    .flatten()
    .map(res => res.text)
    .replaceError(() => 'error')
    .startWith('loading ..')

  const vtree$ = testValue$.map(text => h('div', text))
  return {
    DOM: vtree$,
    HTTP: request$
  }
}
