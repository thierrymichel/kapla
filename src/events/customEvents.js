import { Multimap } from '../multimap';
import { ee } from './Bus';
import { CustomEvent } from './CustomEvent';

class CustomEvents {
  constructor() {
    this._types = new Set();
    this._typesByScope = new Multimap();
    this._eventByType = new Map();
    this._componentsByType = new Multimap();
  }

  get events() {
    return Array.from(this.types);
  }

  get types() {
    return this._types;
  }

  getScope(type) {
    return this._typesByScope.getKeysForValue(type)[0];
  }

  getEvent(type) {
    return this._eventByType.get(type);
  }

  add(type, e, log = true) {
    const event = e || new CustomEvent(type, log);
    const scope = event.scope || 'component';

    this._types.add(type);
    this._typesByScope.add(scope, type);
    this._eventByType.set(type, event);

    if (scope === 'global') {
      ee.add(type, event.log);
    }
  }

  bind(type, component, options) {
    const scope = this.getScope(type);
    const event = this.getEvent(type);

    if (scope === 'global') {
      if (!this._componentsByType.getValuesForKey(type).includes(component)) {
        event.bind(component, ee, options);
      }

      this._componentsByType.add(type, component);
    } else {
      event.bind(component, ee, options);
    }
  }

  unbind(type, component) {
    const scope = this.getScope(type);
    const event = this.getEvent(type);


    if (scope === 'global') {
      if (this._componentsByType.has(type, component)) {
        event.unbind(component, ee);
        this._componentsByType.delete(type, component);
      }
    } else {
      event.unbind(component, ee);
    }
  }
}

export const customEvents = new CustomEvents();
