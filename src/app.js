import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import {navigation} from './navigation';

function view(state) {
  let navigationItems = [
    {href: 'home', name: 'Home'},
    {href: 'articles', name: 'Articles'}
  ];

  return Cycle.Rx.Observable.just(false).map(just =>
    h('header', h('blog-navigation', {items: navigationItems}))
  );
}

function main({DOM}) {
  return {
    DOM: view()
  };
}

let drivers = {
  DOM: makeDOMDriver('#app', {
    'blog-navigation': navigation
  })
};

Cycle.run(main, drivers);
