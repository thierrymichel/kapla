/* global test, expect */
import { Application } from 'kapla/src';

test('Application with defaults', () => {
  const app = Application.start();

  expect(app.element instanceof HTMLBodyElement).toBeTruthy();
  expect(app.schema.componentAttribute).toBe('data-component');
  expect(app.schema.refAttribute).toBe('data-ref');
});

test('Application with element', () => {
  const element = document.createElement('section');
  const app = Application.start(element);

  expect(app.element instanceof HTMLElement).toBeTruthy();
  expect(app.element.nodeName).toBe('SECTION');
});

test('Application with custom schema', () => {
  const app = Application.start(document.body, {
    componentAttribute: 'data-foo',
    refAttribute: 'data-bar',
  });

  expect(app.schema.componentAttribute).toBe('data-foo');
  expect(app.schema.refAttribute).toBe('data-bar');
});
