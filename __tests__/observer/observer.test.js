/* global it, expect */
import { createApplication, createComponent } from 'utils/setup';
import { addElement, removeElement } from 'utils/dom';

const Foo = createComponent('foo');
const app = createApplication();

app.register('foo', Foo);

const { increment } = app.manager.contexts[0].component;

it('observes added element', () => {
  expect(increment).toBe(1);

  addElement('foo');

  requestAnimationFrame(() => {
    expect(increment).toBe(2);
  });
});

it('observes removed element', () => {
  removeElement('foo');

  requestAnimationFrame(() => {
    expect(increment).toBe(1);
  });
});

it('observes no more element', () => {
  removeElement('foo');

  requestAnimationFrame(() => {
    expect(increment).toBe(0);
  });
});
