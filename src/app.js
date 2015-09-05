import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';
import {renderHeader} from './header/header';
import {renderFooter} from './footer/footer';
import {navigation} from './navigation';
import {routerView} from './router/router';
import 'normalize.css';
import './fonts/dejavu.less';
import './app.less';

function view(state) {
  // TODO router view
  //var routerView = h('div.router-view', 'Here goes big pile of shit');
  return Cycle.Rx.Observable.just(false).map(just =>
    h('div#app-container', [renderHeader(), routerView(), renderFooter()])
  );
}

function main(drivers) {
  return {
    DOM: view()
  };
}

let drivers = {
  DOM: makeDOMDriver('#app', {
    'blog-navigation': navigation
  })
};

if (module.hot) {
  module.hot.accept();
}

Cycle.run(main, drivers);
