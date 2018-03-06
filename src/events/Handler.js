import detectIt from 'detect-it';

import {
  ucfirst,
  lcfirst,
} from '../helpers';

import { ee } from './Bus';
import passiveEvents from './passiveEvents';
import mixedEvents from './mixedEvents';
import * as customEvents from './customEvents';

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
    console.info('context????', context, this);
  }

  static getMethod(eventName) {
    // DEV -> will change with customEvents
    const name = mixedEvents.hasValue(eventName) ?
      mixedEvents.getKeysForValue(eventName)[0] :
      eventName;
    const type = ucfirst(name);

    return `on${type}`;
  }

  static getType(eventName) {
    // Global binded event
    if (ee.events.includes(eventName)) {
      return 'global';
    }

    // Custom events
    if (customEvents[eventName]) {
      return 'custom';
    }

    // Mixed events
    if (mixedEvents.hasKey(eventName)) {
      return 'mixed';
    }

    // Default
    return 'native';
  }

  static getOptions(eventName, opts = { capture: false }) {
    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    if (passiveEvents.includes(eventName)) {
      opts.passive = true;
    }

    return detectIt.passiveEvents === true ? opts : opts.capture;
  }

  handleEvent(e) {
    this[Handler.getMethod(e.type)](e);
  }

  bind() {
    const events = this.constructor.events || [];

    // Check for native, global, mixed, custom…
    events.forEach(event => {
      switch (Handler.getType(event)) {
        case 'global':
          ee.on(event, this[Handler.getMethod(event)], this);
          break;

        case 'mixed':
          mixedEvents.getValuesForKey(event).forEach(mixed => {
            this.context.element.addEventListener(mixed, this, Handler.getOptions(mixed));
          });
          break;

        case 'custom':
          customEvents[event].bind(this);
          break;

        case 'native':
        default:
          this.context.element.addEventListener(event, this, Handler.getOptions(event));
      }
    });
  }

  unbind() {
    const { events } = this.constructor;

    events.forEach(event => {
      switch (Handler.getType(event)) {
        case 'global':
          ee.off(event, this[Handler.getMethod(event)]);
          break;

        case 'mixed':
          mixedEvents.getValuesForKey(event).forEach(mixed => {
            this.context.element.removeEventListener(mixed, this);
          });
          break;

        case 'custom':
          customEvents[event].unbind(this);
          break;
        case 'native':
        default:
          this.context.element.removeEventListener(event, this);
      }
    });
  }
}
