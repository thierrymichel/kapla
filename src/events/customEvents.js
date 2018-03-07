import { Multimap } from '../multimap';
import { ee } from './Bus';

class CustomEvents {
  constructor() {
    this.types = new Set();
    this._typesByScope = new Multimap();
    this._eventByType = new Map();
    this._componentsByType = new Multimap();
  }

  get events() {
    return Array.from(this.types);
  }

  getScope(type) {
    return this._typesByScope.getKeysForValue(type)[0];
  }

  getEvent(type) {
    return this._eventByType.get(type);
  }

  add(type, event) {
    const scope = event.scope || 'component';

    this._typesByScope.add(scope, type);
    this._eventByType.set(type, event);

    if (scope === 'global') {
      ee.add(type, event.log);
    }
  }

  bind(type, component) {
    const scope = this.getScope(type);
    const event = this.getEvent(type);

    if (scope === 'global') {
      if (!this._componentsByType.hasKey(type)) {
        event.bind(component, ee);
      }

      this._componentsByType.add(type, component);
    } else {
      event.bind(component, ee);
    }
  }

  unbind(type, component) {
    const scope = this.getScope(type);
    const event = this.getEvent(type);

    if (scope === 'global') {
      this._componentsByType.delete(type, component);

      if (!this._componentsByType.hasKey(type)) {
        event.unbind(component, ee);
      }
    } else {
      event.unbind(component, ee);
    }
  }
}

export const customEvents = new CustomEvents();
