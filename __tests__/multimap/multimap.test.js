/* global it, expect */
import { Multimap } from 'kapla/src/multimap';

const map = new Multimap();

it('init', () => {
  expect(map.valuesByKey instanceof Map).toBeTruthy();
  expect(map.values).toHaveLength(0);
  expect(map.size).toBe(0);
});

it('adds', () => {
  map.add('k1', 'foo');

  expect(map.size).toBe(1);

  map.add('k1', 'bar');

  expect(map.size).toBe(2);

  map.add('k2', 'foo');

  expect(map.size).toBe(3);
  expect(map.size).toEqual(map.values.length);
});

it('has', () => {
  expect(map.has('k1', 'foo')).toBeTruthy();
  expect(map.has('k1', 'bar')).toBeTruthy();
  expect(map.has('k2', 'foo')).toBeTruthy();
});

it('has key', () => {
  expect(map.hasKey('k1')).toBeTruthy();
  expect(map.hasKey('k2')).toBeTruthy();
});

it('has value', () => {
  expect(map.hasValue('foo')).toBeTruthy();
  expect(map.hasValue('bar')).toBeTruthy();
});

it('has values for key', () => {
  expect(map.getValuesForKey('k1')).toHaveLength(2);
  expect(map.getValuesForKey('k2')).toHaveLength(1);
  expect(map.getValuesForKey('k3')).toHaveLength(0);
});

it('has keys for value', () => {
  expect(map.getKeysForValue('foo')).toHaveLength(2);
  expect(map.getKeysForValue('bar')).toHaveLength(1);
  expect(map.getKeysForValue('baz')).toHaveLength(0);
});

it('deletes', () => {
  map.delete('k1', 'foo');

  expect(map.has('k1', 'foo')).toBeFalsy();
  expect(map.hasKey('k1')).toBeTruthy();
  expect(map.hasValue('foo')).toBeTruthy();
  expect(map.getValuesForKey('k1')).toHaveLength(1);
  expect(map.getKeysForValue('foo')).toHaveLength(1);

  map.delete('k1', 'bar');

  expect(map.has('k1', 'bar')).toBeFalsy();
  expect(map.hasKey('k1')).toBeFalsy();
  expect(map.hasValue('bar')).toBeFalsy();

  map.delete('k2', 'foo');

  expect(map.has('k2', 'foo')).toBeFalsy();
  expect(map.hasKey('k2')).toBeFalsy();
  expect(map.hasValue('foo')).toBeFalsy();
});
