import xs from 'xstream'
import {div} from '@cycle/dom'

export default function Posts() {
  return {
    DOM: xs.of(div('it WOKRS !!'))
  }
}
