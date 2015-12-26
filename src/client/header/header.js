import {header, div, h1, h2} from '@cycle/dom'

let binary = Number(420).toString(2)
let numberOfZeroes = 16 - binary.length
let zeroes = '0'.repeat(numberOfZeroes)
export const fourTwenty = zeroes + binary

export const renderHeader = () => header('.site-header', [
  div('.header-top', [
    h1('.header-top-item', "Michal's blog"),
    div('.header-top-item', 'placeholder')
  ]),
  h2('.page-title', 'Once upon a time. Michals journey'),
  div('.motto', fourTwenty)
])
