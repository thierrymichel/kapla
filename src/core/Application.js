import { defaultSchema } from './schema';
import { Manager } from './Manager';

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

  // eslint-disable-next-line class-methods-use-this
  handleError(error, message) {
    // DEV
    // console.error('%s\n\n%o\n\n%o', message, error, detail);
    // console.error(error);
    throw new Error(`🤦 ${message}`);
  }
}
