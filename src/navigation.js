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
        .doOnNext(ev => ev.preventDefault())
        .map(ev => ev.target.attributes.href.value)
    };
  }

  function model(context, action$) {
    let items$ = context.props.get('items').first();

    let state$ = Cycle.Rx.Observable.combineLatest(items$, action$.navigate$.startWith(false), (items, action) => {
      return {items, selectedItem: action};
    });
    return state$;
  }

  function view(state$) {
    return state$.map(state => {
      let items = state.items;
      let selectedItem = state.selectedItem;

      return h('nav.navigation',
        items.map(item => {
          let isSelected = item.href === selectedItem  ? 'selected' : '';
          return h('a', {href: item.href, className: isSelected}, item.name);
        })
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
