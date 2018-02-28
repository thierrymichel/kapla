/* global it, expect */
import { createApplication, createComponent } from 'utils/setup';

const Foo = createComponent('foo');
const app = createApplication();

app.register('foo', Foo);

const instance = app.manager.contexts[0].component;
const element = instance.$element;
const ref = document.createElement('div');

ref.setAttribute('data-ref', 'foo.child');

it('has single ref', () => {
  element.appendChild(ref);

  expect(instance.$refs.child instanceof HTMLDivElement).toBeTruthy();
});

it('has multiple refs', () => {
  element.appendChild(ref.cloneNode());

  expect(instance.$refs.child instanceof Array).toBeTruthy();
  expect(instance.$refs.child.length).toBe(2);
});
