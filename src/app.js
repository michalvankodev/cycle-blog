import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

function main() {
  return {
    DOM: Cycle.Rx.Observable.interval(1000)
      .map(i => CycleDOM.h(
        'h1', '' + i + ' seconds 123df'
      ))
  };
}

let drivers = {
  DOM: CycleDOM.makeDOMDriver('#app')
};

Cycle.run(main, drivers);
