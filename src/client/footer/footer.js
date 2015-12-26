import {footer, p} from '@cycle/dom'

export const renderFooter = () => footer('.site-footer', [
  p('Here goes text from database'),
  p('Follow me: @github @twitter @linkedin')
])
