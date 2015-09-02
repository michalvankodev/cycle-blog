/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import './footer.less';

export function renderFooter() {
  return (
    <footer className='site-footer'>
      <p>Here goes text from database</p>
      <p>Follow me: @github @twitter @linkedin</p>
    </footer>
  );
}
