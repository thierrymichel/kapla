import EventEmitter from 'eventemitter3';

class Bus extends EventEmitter {
  constructor() {
    super();
    this._logs = new Set();
  }

  emit(...args) {
    const [name, ...params] = args;

    if (this._logs.has(name)) {
      console.info('💁‍♂️️', name, params);
    }

    super.emit(...args);
  }

  add(name, log = true) {
    if (log) {
      this._logs.add(name);
    }
  }

  remove(name) {
    if (this._logs.has(name)) {
      this._logs.delete(name);
    }
  }
}

export const ee = new Bus();
