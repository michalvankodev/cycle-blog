import {html as vhtml, head, title, link, body, div, script} from '@cycle/dom'

/**
 * Wraps VTree produced by App into the HTML boilerplate
 *
 * @param {Object} vtree Virtual DOM created by an App to be rendered into HTML
 * @returns {Object} Virtual DOM of the HTML to be rendered
 */
export function wrapVTreeWithHTMLBoilerplate(vtree) {
  return vhtml([
    head([
      title("Michal's blog"),
      link({href: `dist/styles.css`, rel: `stylesheet`})
    ]),
    body([
      div('#app', [vtree]),
      script({src: `static/bundle.js`})
    ])
  ])
}

/**
 * Prepends HTML5 Doctype before HTML
 *
 * @param {string} html
 * @return {string} html prepended by doctype
 */
export function prependDoctype(html) {
  return `<!doctype html>${html}`
}
