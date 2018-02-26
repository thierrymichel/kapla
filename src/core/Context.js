import { Scope } from './Scope';

export class Context {
  constructor(module, element) {
    this.module = module;
    this.element = element;
    this.scope = new Scope(this.schema, this.slug, element);

    try {
      this.component = new module.ComponentConstructor(this);
      this.component.load();
    } catch (error) {
      this.handleError(error, 'loading component');
    }
  }

  init() {
    try {
      this.component.init();
    } catch (error) {
      this.handleError(error, 'initializing component');
    }
  }

  destroy() {
    try {
      this.component.destroy();
    } catch (error) {
      this.handleError(error, 'destroying component');
    }
  }

  get application() {
    return this.module.application;
  }

  get slug() {
    return this.module.slug;
  }

  get schema() {
    return this.application.schema;
  }

  // Error handling
  handleError(error, message, detail = {}) {
    const { identifier, component, element } = this;

    // eslint-disable-next-line no-param-reassign
    detail = Object.assign({
      identifier,
      component,
      element,
    }, detail);

    this.application.handleError(error, `Error ${message}`, detail);
  }
}
