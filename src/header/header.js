/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
//import './header.less';

let binary = Number(420).toString(2);
let numberOfZeroes = 16 - binary.length;
let zeroes = '0'.repeat(numberOfZeroes);
export const fourTwenty = zeroes + binary;

let navigationItems = [
  { href: '/home', name: 'Home'},
  { href: '/articles', name: 'Articles '}
];

export function renderHeader() {

  return (
    <header className='site-header'>
      <div className='header-top'>
        <h1 className='header-top-item'>Michal's blog</h1>
        <blog-navigation items={navigationItems} className='header-top-item' />
      </div>
      <h2 className='page-title'>Once upon a time. Michals journey</h2>
      <div className='motto'>{fourTwenty}</div>
    </header>
  );
}
