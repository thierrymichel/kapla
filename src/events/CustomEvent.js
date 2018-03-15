import { ucfirst } from '../helpers';

export default class CustomEvent {
  constructor(name) {
    this.name = name;
    this.type = `on${ucfirst(name)}`;
    this.log = true;
    this.eventsByElements = new Map();
  }

  bind(component, ee) {
    this.eventsByElements.set(component.context.element, this.listener(component));

    ee.on(this.name, this.eventsByElements.get(component.context.element));
  }

  unbind(component, ee) {
    ee.off(this.name, this.eventsByElements.get(component.context.element));
  }

  listener(component) {
    const type = `on${ucfirst(this.name)}`;

    return function listener(...args) {
      component[type](...args);
    };
  }
}
