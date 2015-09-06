import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import {home} from '../pages/home';

export function routerView(sources, name = '') {

  let domNavigate$ = sources.DOM.select('a').events('click')
    .doOnNext(ev => ev.preventDefault())
    .map(ev => ev.target.attributes.href.value)
    .startWith('home');

  let navigateTo$ = domNavigate$;
  //Rx.Observable.merge(domNavigate$, sources.events.navigateTo$);

  let routes = Rx.Observable.just([
    { href: 'home', name: 'Home', view: home},
    { href: 'articles', name: 'Articles '}
  ]);

  let activeRoute$ = Rx.Observable.combineLatest(routes, navigateTo$, function (routes, navigateTo) {
      return routes.find(route => route.href == navigateTo);
  });

  let routedView$ = activeRoute$.map(route => route.view(sources));

  let routerView$ = routedView$.map(view => h('div.router-view', view.DOM));

  return {
    DOM: routerView$
  };
}
