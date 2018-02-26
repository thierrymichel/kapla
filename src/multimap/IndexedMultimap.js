import { Multimap } from './Multimap';
import { add, del } from './utils';

export class IndexedMultimap extends Multimap {
  constructor() {
    super();
    this.keysByValue = new Map();
  }

  get values() {
    return Array.from(this.keysByValue.keys());
  }

  add(key, value) {
    super.add(key, value);
    add(this.keysByValue, value, key);
  }

  delete(key, value) {
    super.delete(key, value);
    del(this.keysByValue, value, key);
  }

  hasValue(value) {
    return this.keysByValue.has(value);
  }

  getKeysForValue(value) {
    const set = this.keysByValue.get(value);

    return set ? Array.from(set) : [];
  }
}
