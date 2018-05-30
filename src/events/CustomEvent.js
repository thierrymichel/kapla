import { ucfirst } from '../helpers';

export class CustomEvent {
  constructor(name, log) {
    this.name = name;
    this.capitalizedName = ucfirst(name);
    this.scope = 'global';
    this.log = log;
    this.eventByElement = new Map();
  }

  bind(component, ee) {
    const { element } = component.context;

    this.eventByElement.set(element, this.listener(component));

    ee.on(this.name, this.eventByElement.get(element));
  }

  unbind(component, ee) {
    const { element } = component.context;

    ee.off(this.name, this.eventByElement.get(element));
  }

  listener(component) {
    const type = `on${this.capitalizedName}`;

    return function listener(...args) {
      component[type](...args);
    };
  }
}
