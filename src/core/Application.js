import { defaultSchema } from './schema';

export default class Application {
  static start(element, schema) {
    const application = new Application(element, schema);

    application.start();

    return application;
  }

  constructor(element = document.body, schema = defaultSchema) {
    this.element = element;
    this.schema = schema;
  }

  start() {
    console.info('start', this.element, this.schema);
  }

  stop() { // eslint-disable-line class-methods-use-this
    console.info('stop');
  }

  register(slug, componentConstructor) {
    this.load({
      slug,
      componentConstructor,
    });
  }

  load(definitions) {
    definitions.forEach(def => {
      if (def) {
        this.mod = new def.ComponentConstructor();
      }
    });
  }
}
