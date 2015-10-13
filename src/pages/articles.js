import {h} from '@cycle/dom';
import Rx from 'rx';

export default function articles(drivers) {
  const request$ = Rx.Observable.just('/api/test');

  const testValue$ = drivers.HTTP
    .filter(res$ => res$.request === '/api/test')
    .mergeAll()
    .map(res => res.text)
    .startWith('loading ..');

  const vtree$ = testValue$.map(text => h('div', text));
  return {
    DOM: vtree$,
    HTTP: request$
  };
}
