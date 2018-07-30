import exclamations from '../errors';

import { defaultSchema } from './schema';
import { Manager } from './Manager';
import { customEvents } from '../events';

export class Application {
  static start(element, schema, props) {
    const application = new Application(element, schema, props);

    application.start();

    return application;
  }

  constructor(element = document.body, schema = defaultSchema, props) {
    this.element = element;
    this.schema = schema;
    this.props = props;
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

  init(slug, NoComponentConstructor, ...args) {
    this.manager.addModule({
      slug,
      ComponentConstructor: NoComponentConstructor,
    }, args);
  }

  unload(slugs) {
    const items = Array.isArray(slugs) ? slugs : [slugs];

    items.forEach(slug => this.manager.removeModule(slug));
  }

  get components() {
    return this.manager.contexts.map(context => context.component);
  }

  use(type, event, log) {
    if (this.customEvents.types.has(type)) {
      this.handleError('oups', `This event type already exists [${type}]`);
    }

    this.customEvents.add(type, event, log);
  }

  get events() {
    return this.customEvents.events;
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(error, message) {
    // DEV
    // console.error('%s\n\n%o\n\n%o', message, error, detail);
    throw new Error(`🤦 ${exclamations.random()}! ${message} \n ${error}`);
  }
}
