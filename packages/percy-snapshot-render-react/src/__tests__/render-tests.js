/**
 * @jest-environment jsdom
 */

/* eslint-env browser */

import React from 'react';
import render from '../';

let el;

beforeEach(() => {
  document.body.innerHTML = '';

  el = document.createElement('div');
  document.body.appendChild(el);
});

it('renders the specified React markup into the DOM element', () => {
  const markup = <div>some markup</div>;

  render(markup, el);

  expect(el.innerHTML).toMatchSnapshot();
});
