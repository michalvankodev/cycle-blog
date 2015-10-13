import Cycle from '@cycle/core';
import {h, makeDOMDriver} from '@cycle/dom';

import {makeHTTPDriver} from '@cycle/http';
import {renderHeader} from './header/header';
import {renderFooter} from './footer/footer';

import {routerView} from './router/router';
import articles from './pages/articles';
import Rx from 'rx';
// import 'normalize.css';
// import './fonts/dejavu.less';
// import './app.less';

function view(drivers) {

  let router = routerView(drivers);
  const arts = articles(drivers);

  return arts.DOM.map(routerView =>
    h('div#app-container', [renderHeader(), routerView, renderFooter()])
  );
}

export function main(drivers) {
  const url$ = drivers.DOM.select('a').events('click')
    .map(e => e.target.href);//.filter(filterLinks);
  const http$ = Rx.Observable.just('http://localhost:3000/api/test');
  /// TURURURURU
  return {
    DOM: view(drivers),
    History: url$,
    HTTP: http$
  };
}


if (module.hot) {
  module.hot.accept();
}
