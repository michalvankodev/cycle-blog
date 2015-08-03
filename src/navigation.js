import Cycle from '@cycle/core';
import {h} from '@cycle/dom';

/**
 * Navigation widget
 * Navigates to pages.
 * TODO: Router, Tests, Comments
 */
export function navigation(responses) {
  /**
   * Intent of the navigation component
   * //TODO test and comments
   */
  function intent(DOM) {
    return {
      navigate$: DOM.get('.navigation a', 'click')
        .map(ev => ev.target.value)
    };
  }

  function model(context, action$) {
    let items$ = context.props.get('items').first();
    return items$;
  }

  function view(state$) {
    return state$.map(state => {
      let items = state;
      //let selected = state.value;

      return h('nav.navigation',
        items.map(item => h('a', {href: item.href}, item.name))
      );

    });
  }

  let actions = intent(responses.DOM);
  let vtree$ = view(model(responses, actions));

  return {
    DOM: vtree$,
    events: {
      navigateTo: actions.navigate$
    }
  };
}
