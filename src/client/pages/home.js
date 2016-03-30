import {div} from '@cycle/dom'
import {Observable} from 'rx'

export default function Home(sources) {
  return {
    DOM: Observable.just(div('HOME PAGE YEAY'))
  }
}
