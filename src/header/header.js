/** @jsx hJSX */
import {hJSX} from '@cycle/dom';

let binary = Number(420).toString(2);
let numberOfZeroes = 16 - binary.length;
let zeroes = '0'.repeat(numberOfZeroes);
const fourTwenty = zeroes + binary;

let navigationItems = [
  { href: 'home', name: 'Home'},
  { href: 'articles', name: 'Artisssssscless '}
];

export function renderHeader() {

  return (
    <header>
      <h1>Michal's blog</h1>
      <div className='motto'>{fourTwenty}</div>
      <blog-navigation items={navigationItems} />
    </header>
  );
}
