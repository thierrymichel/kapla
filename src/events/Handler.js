import detectIt from 'detect-it';

import {
  ucfirst,
  lcfirst,
} from '../helpers';

import {
  customEvents,
  mixedEvents,
  passiveEvents,
} from '../events';

export class Handler {
  static get events() {
    return this._events || Object.defineProperty(
      this,
      '_events',
      {
        value: Object.getOwnPropertyNames(this.prototype)
          .filter(type => (/^on/).test(type))
          .map(type => lcfirst(type.slice(2))),
      }
    )._events;
  }

  constructor(context) {
    this.context = context;
  }

  static getMethod(eventName) {
    const name = mixedEvents.hasValue(eventName) ?
      mixedEvents.getKeysForValue(eventName)[0] :
      eventName;
    const type = ucfirst(name);

    return `on${type}`;
  }

  static getOptions(type, opts = { capture: false }) {
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    if (passiveEvents.includes(type)) {
      opts.passive = true;
    }

    return detectIt.passiveEvents === true ? opts : opts.capture;
  }

  getCategory(type) {
    // Custom event
    if (customEvents.getScope(type)) {
      return 'custom';
    }

    // Mixed event
    if (mixedEvents.hasKey(type)) {
      return 'mixed';
    }

    // Native event
    if (this[Handler.getMethod(type)]) {
      return 'native';
    }

    return false;
  }

  _bindEvent(type) {
    const category = this.getCategory(type);

    if (!category) {
      return;
    }

    switch (category) {
      case 'custom':
        customEvents.bind(type, this);
        break;

      case 'mixed':
        mixedEvents.getValuesForKey(type).forEach(mixed => {
          this.context.element.addEventListener(mixed, this, Handler.getOptions(mixed));
        });
        break;

      case 'native':
        this.context.element.addEventListener(type, this, Handler.getOptions(type));
        break;

      default:
        console.warn(`Unknown event type [${type}]`);
        break;
    }
  }

  _unbindEvent(type) {
    const category = this.getCategory(type);

    if (!category) {
      return;
    }

    switch (category) {
      case 'custom':
        customEvents.unbind(type, this);
        break;

      case 'mixed':
        mixedEvents.getValuesForKey(type).forEach(mixed => {
          this.context.element.removeEventListener(mixed, this, Handler.getOptions(mixed));
        });
        break;

      case 'native':
        this.context.element.removeEventListener(type, this, Handler.getOptions(type));
        break;

      default:
        console.warn(`Unknown event type [${type}]`);
        break;
    }
  }

  handleEvent(e) {
    this[Handler.getMethod(e.type)](e);
  }

  bindAll() {
    const events = this.constructor.events || [];

    events.forEach(type => {
      this._bindEvent(type);
    });
  }

  unbindAll() {
    const { events } = this.constructor;

    events.forEach(type => {
      this._unbindEvent(type);
    });
  }

  bind(type) {
    this._bindEvent(type);
  }

  unbind(type) {
    this._unbindEvent(type);
  }
}
