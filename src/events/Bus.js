import EventEmitter from 'eventemitter3';

class Bus extends EventEmitter {
  constructor() {
    super();
    this._events = new Set();
    this._logs = new Set();
  }

  get events() {
    return Array.from(this._events);
  }

  emit(...args) {
    const [name, ...params] = args;

    if (this._logs.has(name)) {
      console.info(name, params);
    }

    super.emit(...args);
  }

  add(name, log = true) {
    this._events.add(name);

    if (log) {
      this._logs.add(name);
    }
  }

  remove(name) {
    if (this._events.has(name)) {
      this._events.delete(name);
    }
    if (this._logs.has(name)) {
      this._logs.delete(name);
    }
  }
}

export const ee = new Bus();
