/* global test, expect */
import { Application, Component } from 'kapla/src';

// DOM
const fooComponent = document.createElement('div');
const barComponent = fooComponent.cloneNode();

fooComponent.setAttribute('data-component', 'foo');
document.body.appendChild(fooComponent);
barComponent.setAttribute('data-component', 'bar');
document.body.appendChild(barComponent);

// JS
class Foo extends Component {}
class Bar extends Component {}
const app = Application.start();

test('Application register component', () => {
  app.register('foo', Foo);

  expect(app.components.length).toBe(1);
});

test('Application register same component', () => {
  app.register('foo', Foo);

  expect(app.components.length).toBe(1);
});

test('Application load component', () => {
  app.load({
    slug: 'bar',
    ComponentConstructor: Bar,
  });

  expect(app.components.length).toBe(2);
});

test('Application unload components', () => {
  app.unload(['bar']);

  expect(app.components.length).toBe(1);

  app.unload(['foo']);

  expect(app.components.length).toBe(0);
});
