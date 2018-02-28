/* global it, expect */
import { createApplication, createComponent } from 'utils/setup';

const Foo = createComponent('foo');
const Bar = createComponent('bar');
const Baz = createComponent('baz');
const Qux = createComponent('qux');
const app = createApplication();

it('register component', () => {
  app.register('foo', Foo);
  const instance = app.manager.contexts[0].component;

  expect(app.components.length).toBe(1);
  expect(instance.slug).toBe('foo');
  expect(app.manager.contexts.filter(ctx => ctx.slug === 'foo')).toHaveLength(1);
});

it('register same component', () => {
  app.register('foo', Foo);

  expect(app.components.length).toBe(1);
  expect(app.manager.contexts.filter(ctx => ctx.slug === 'foo')).toHaveLength(1);
});

it('load component', () => {
  app.load({
    slug: 'bar',
    ComponentConstructor: Bar,
  });

  expect(app.components.length).toBe(2);
  expect(app.manager.contexts.filter(ctx => ctx.slug === 'bar')).toHaveLength(1);
});

it('load components', () => {
  app.load([
    {
      slug: 'baz',
      ComponentConstructor: Baz,
    },
    {
      slug: 'qux',
      ComponentConstructor: Qux,
    },
  ]);

  expect(app.components.length).toBe(4);
  expect(app.manager.contexts.filter(ctx => ctx.slug === 'baz')).toHaveLength(1);
  expect(app.manager.contexts.filter(ctx => ctx.slug === 'qux')).toHaveLength(1);
});

it('unload component', () => {
  app.unload('foo');

  expect(app.components.length).toBe(3);
  expect(app.manager.contexts.filter(ctx => ctx.slug === 'foo')).toHaveLength(0);
});

it('unload components', () => {
  app.unload(['bar', 'baz', 'qux']);

  expect(app.components.length).toBe(0);
  expect(app.manager.contexts.filter(ctx => ctx.slug === 'bar')).toHaveLength(0);
});
