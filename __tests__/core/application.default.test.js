/* global it, expect */
import { createApplication } from 'utils/setup';

it('starts with defaults', () => {
  const app = createApplication();

  expect(app.element instanceof HTMLBodyElement).toBeTruthy();
  expect(app.schema.componentAttribute).toBe('data-component');
  expect(app.schema.refAttribute).toBe('data-ref');
});

it('starts with custom element', () => {
  const app = createApplication(document.createElement('section'));

  expect(app.element instanceof HTMLElement).toBeTruthy();
  expect(app.element.nodeName).toBe('SECTION');
});

it('starts with custom schema', () => {
  const app = createApplication(document.body, {
    componentAttribute: 'data-foo',
    refAttribute: 'data-bar',
  });

  expect(app.schema.componentAttribute).toBe('data-foo');
  expect(app.schema.refAttribute).toBe('data-bar');
});

it('stops', () => {
  const app = createApplication();

  app.stop();

  expect(app.manager.observer.started).toBeFalsy();
});
