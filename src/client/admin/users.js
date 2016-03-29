import {Observable} from 'rx'
import {div} from '@cycle/dom'

export default function Users() {

  return {
    DOM: Observable.just(div('it WOKRS !!'))
  }
}
