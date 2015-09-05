import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import {home} from '../pages/home';

function intent(DOM, route$) {
  let domNavigate$ = DOM.select('a').events('click')
    .doOnNext(ev => ev.preventDefault())
    .map(ev => ev.target.attributes.href.value);

  return Rx.merge(domNavigate$, route$);
}

function model(action$) {
  let routes = [
    { href: 'home', name: 'Home', view: home},
    { href: 'articles', name: 'Articles '}
  ];


}

function view(state$) {
  return h('div.router-view', state$.activeRoute.DOM);
}

export function routerView(sources, name = '') {

  let actions = intent(sources.DOM, sources.route$);
  let state$ = model(actions);

  return view(state$);
}
