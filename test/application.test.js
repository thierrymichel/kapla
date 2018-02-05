/* global test, expect */
import { Application } from '../src';

const app = Application.start();

test('test… #1', () => {
  expect(app.element instanceof HTMLBodyElement).toBeTruthy();
});

test('test… #2', () => {
  expect(app.schema.componentAttribute).toBe('data-component');
});
