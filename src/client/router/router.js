import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import {home} from '../pages/home';
import {articles} from '../pages/articles';
import switchPath from 'switch-path';

export function routerView(drivers, name = '') {

  let routes = {
    '/home': 'home',
    '/articles': 'articles'
  };

  const value$ = drivers.History.map(location => { // History Location Object
    let {path, value} = switchPath(location.pathname, routes)
    return value
  });

  let routeMappings = {
    'home': home,
    'articles': articles
  };

  const view$ = value$.map(value => h('div.router-view', routeMappings[value](drivers).DOM));
  const http$ = value$.map(value => routeMappings[value](drivers).HTTP)
  return {
    DOM: view$,
    HTTP: http$
  };
}
