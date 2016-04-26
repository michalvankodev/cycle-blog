import {div} from '@cycle/dom'
import xs from 'xstream'

export default function Home(sources) {
  return {
    DOM: xs.of(div('HOME PAGE YEAY'))
  }
}
