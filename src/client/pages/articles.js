import {h} from '@cycle/dom'
import xs from 'xstream'

export default function Articles({HTTP}) {
  let url = process.title !== 'a' ? 'http://localhost:8000/api/articles' : 'api/articles'

  const request$ = xs.of({
    url,
    category: 'articles'
  }).remember().debug()

  const testValue$ = HTTP
    .select('articles')
    .flatten()
    .map(res => res.text)
    .startWith('loading ..')

  const vtree$ = testValue$.map(text => h('div', text))
  return {
    DOM: vtree$,
    HTTP: request$
  }
}
