import { Module } from './Module';

export class Manager {
  constructor(application) {
    this.application = application;
    this.modulesBySlug = new Map();
  }

  get schema() {
    return this.application.schema;
  }

  get element() {
    return this.application.element;
  }

  get componentAttribute() {
    return this.schema.componentAttribute;
  }

  get modules() {
    return Array.from(this.modulesBySlug.values());
  }

  /* eslint-disable class-methods-use-this */
  start() {
    console.info('Manager:start');
  }

  stop() {
    console.info('Manager:stop');
  }
  /* eslint-enable class-methods-use-this */

  addModule(definition) {
    console.info('Manager:addModule', definition.slug);
    const { slug } = definition;

    this.removeModule(slug);

    const module = new Module(this.application, definition);

    this.modulesBySlug.set(slug, module);
    // Connect module
  }

  removeModule(slug) {
    const module = this.modulesBySlug.get(slug);

    if (module) {
      this.modulesBySlug.delete(slug);
      // Disconnect module
    }
  }
}
