import {Observable} from 'rx'
import {div} from '@cycle/dom'
export default function Admin() {
  return {
    DOM: Observable.just(div('it WORKS !!'))
  }
}
