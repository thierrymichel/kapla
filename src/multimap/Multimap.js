import { add, del } from './utils';

export class Multimap {
  constructor() {
    this.valuesByKey = new Map();
  }

  get values() {
    const sets = Array.from(this.valuesByKey.values());

    return sets.reduce((values, set) => values.concat(Array.from(set)), []);
  }

  get size() {
    const sets = Array.from(this.valuesByKey.values());

    return sets.reduce((size, set) => size + set.size, 0);
  }

  add(key, value) {
    add(this.valuesByKey, key, value);
  }

  delete(key, value) {
    del(this.valuesByKey, key, value);
  }

  has(key, value) {
    const values = this.valuesByKey.get(key);

    return values && values.has(value);
  }

  hasKey(key) {
    return this.valuesByKey.has(key);
  }

  hasValue(value) {
    const sets = Array.from(this.valuesByKey.values());

    return sets.some(set => set.has(value));
  }

  getValuesForKey(key) {
    const values = this.valuesByKey.get(key);

    return values ? Array.from(values) : [];
  }

  getKeysForValue(value) {
    return Array.from(this.valuesByKey)
      .filter(([, values]) => values.has(value))
      .map(([key]) => key);
  }
}
