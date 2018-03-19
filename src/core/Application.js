const exclamations = require('exclamation');

import { defaultSchema } from './schema';
import { Manager } from './Manager';
import { customEvents } from '../events';

export class Application {
  static start(element, schema) {
    const application = new Application(element, schema);

    application.start();

    return application;
  }

  constructor(element = document.body, schema = defaultSchema) {
    this.element = element;
    this.schema = schema;
    this.manager = new Manager(this);
    this.customEvents = customEvents;
  }

  start() {
    this.manager.start();
  }

  stop() {
    this.manager.stop();
  }

  register(slug, ComponentConstructor) {
    this.load({
      slug,
      ComponentConstructor,
    });
  }

  load(definitions) {
    const items = Array.isArray(definitions) ? definitions : [definitions];

    items.forEach(def => this.manager.addModule(def));
  }

  unload(slugs) {
    const items = Array.isArray(slugs) ? slugs : [slugs];

    items.forEach(slug => this.manager.removeModule(slug));
  }

  get components() {
    return this.manager.contexts.map(context => context.component);
  }

  use(type, event) {
    if (this.customEvents.types.has(type)) {
      this.handleError('oups', `This event type already exists [${type}]`);
    }

    this.customEvents.add(type, event);
  }

  // DEV
  // bind(...events) {
  //   const items = Array.isArray(events[0]) ? events[0] : [{
  //     name: events[0],
  //     log: events[1],
  //   }];

  //   items.forEach(event => this.bus.add(event.name, event.log));
  // }

  // unbind(names) {
  //   const items = Array.isArray(names) ? names : [names];

  //   items.forEach(name => this.bus.remove(name));
  // }

  get events() {
    return this.customEvents.events;
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(error, message) {
    // DEV
    // console.error('%s\n\n%o\n\n%o', message, error, detail);
    throw new Error(`🤦 ${exclamations.random()}! ${message}`);
  }
}
