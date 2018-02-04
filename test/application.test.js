/* global test, expect */
import { Application } from '../src';

test('test…', () => {
  const app = Application.start();

  expect(app.schema.componentAttribute).toBe('data-component');
});
