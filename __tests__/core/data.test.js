/* global it, expect */
import { createApplication, createComponent } from 'utils/setup';

const Foo = createComponent('foo');
const app = createApplication();

app.register('foo', Foo);

const instance = app.manager.contexts[0].component;
const element = instance.$element;

it('sets data attribute', () => {
  instance.data.set('prop', 'value');

  expect(element.hasAttribute('data-foo-prop')).toBeTruthy();
  expect(element.getAttribute('data-foo-prop')).toBe('value');
  expect(element.dataset.fooProp).toBe('value');
});

it('has data attribute', () => {
  expect(instance.data.has('prop')).toBeTruthy();
});

it('gets data attribute', () => {
  expect(instance.data.get('prop')).toBe('value');
});

it('deletes data attribute', () => {
  instance.data.delete('prop');

  expect(element.hasAttribute('data-foo-prop')).toBeFalsy();
  expect(instance.data.has('prop')).toBeFalsy();
});

it('deletes unknown attribute', () => {
  expect(instance.data.delete('prop')).toBeFalsy();
});

it('sets "complex" data attribute', () => {
  instance.data.set('complexProp', 'value');

  expect(element.hasAttribute('data-foo-complex-prop')).toBeTruthy();
  expect(element.getAttribute('data-foo-complex-prop')).toBe('value');
  expect(element.dataset.fooComplexProp).toBe('value');
});
