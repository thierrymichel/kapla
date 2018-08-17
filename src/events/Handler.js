import detectIt from 'detect-it';
import { groupBy } from 'lodash';

import {
  ucfirst,
  lcfirst,
  $parent,
} from '../helpers';

import {
  customEvents,
  mixedEvents,
  passiveEvents,
  subscribers,
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

  getMethod(eventName) {
    let name = eventName;

    // If part of mixed event, look for mixed event method
    // ex: mousenter -> onEnter ?
    if (
      mixedEvents.hasValue(eventName) &&
      this.constructor.events.includes(mixedEvents.getKeysForValue(eventName)[0])
    ) {
      [name] = mixedEvents.getKeysForValue(eventName);
    }

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

  getCustomOptions(type) {
    return this[`options${ucfirst(type)}`] || false;
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
    if (this[this.getMethod(type)]) {
      return 'native';
    }

    // Snitchy event
    if (this.snitchyTriggers.includes(type.replace(/^snitchy/, ''))) {
      return 'snitchy';
    }

    return false;
  }

  _bindEvent(type) {
    const category = this.getCategory(type);

    if (!category) {
      this.context.handleError(new Error(), `Unknown event type [${type}]`);
    }

    switch (category) {
      case 'custom':
        customEvents.bind(type, this, this.getCustomOptions(type));
        break;

      case 'mixed':
        mixedEvents.getValuesForKey(type).forEach(mixed => {
          this.context.element.addEventListener(mixed, this, Handler.getOptions(mixed));
        });
        break;

      case 'snitchy':
        this.context.element.addEventListener(
          type.replace(/^snitchy/, ''),
          this.snitchy.component.bind(this.snitchy, this.slug, null, this, type.replace(/^snitchy/, ''))
        );
        break;

      case 'native':
      default:
        this.context.element.addEventListener(type, this, Handler.getOptions(type));
        break;
    }
  }

  _unbindEvent(type) {
    const category = this.getCategory(type);

    if (!category) {
      this.context.handleError(new Error(), `Unknown event type [${type}]`);
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

      case 'snitchy':
        this.context.element.removeEventListener(type.replace(/^snitchy/, ''), this);
        break;

      case 'native':
      default:
        this.context.element.removeEventListener(type, this, Handler.getOptions(type));
        break;
    }
  }

  handleEvent(e) {
    // Get correct type (if mixed event) to check for delegate
    const type = mixedEvents.getKeysForValue(e.type)[0] || e.type;
    const delegate = this[`delegate${ucfirst(type)}`];

    if (delegate) {
      let hasMatch = false;
      let targetElement = null;

      if (typeof delegate === 'string') {
        const potentialElements = [...this.context.element.querySelectorAll(delegate)];

        targetElement = e.target.matches(delegate) ? e.target : $parent(e.target, delegate);
        hasMatch = potentialElements.indexOf(targetElement) >= 0;
      } else {
        const els = Array.isArray(delegate) || delegate instanceof NodeList ?
          [...delegate] :
          [delegate];

        hasMatch = els.some(el => {
          if (el === e.target || el.contains(e.target)) {
            targetElement = el;

            return true;
          }

          return false;
        });
      }

      if (hasMatch) {
        this[this.getMethod(e.type)](e, targetElement);
      }
    } else {
      this[this.getMethod(e.type)](e);
    }
  }

  bindAll() {
    const events = this.constructor.events || [];

    // Snitchy stuff
    if (this.snitchy) {
      const data = this.snitchy.variables.components[this.slug];

      if (data) {
        this.snitchyTriggers = [];

        const variables = Object
          .keys(data)
          .map(layer => data[layer])
          .filter(layer => layer.trigger);

        const variablesByTrigger = groupBy(variables, 'trigger');

        Object.keys(variablesByTrigger).forEach(trigger => {
          this.snitchyTriggers.push(trigger);
          this._bindEvent(`snitchy${trigger}`);
        });
      }
    }

    events.forEach(type => {
      this._bindEvent(type);
    });
  }

  unbindAll() {
    const { events } = this.constructor;

    if (this.snitchyTriggers) {
      this.snitchyTriggers.forEach(trigger => {
        this._unbindEvent(`snitchy${trigger}`);
      });
    }

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

  subscribe(slug) {
    return subscribers.add(this, slug);
  }

  emit(...args) { // eslint-disable-line class-methods-use-this
    subscribers.emit(this, ...args);
  }

  unsubscribeAll() {
    subscribers.remove(this);
  }
}
