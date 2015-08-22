import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import {renderHeader} from './header/header';
import {navigation} from './navigation';

function view(state) {

  return Cycle.Rx.Observable.just(false).map(just =>
    renderHeader()
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
