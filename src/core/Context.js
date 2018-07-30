import { Scope } from './Scope';

export class Context {
  constructor(module, element, args = null) {
    this.module = module;
    this.element = element;

    const { props } = this.module.application;

    this.scope = new Scope(this.schema, this.slug, element, props);

    // Args are used only for "no component / mixin" components
    if (args) {
      this.component = new module.ComponentConstructor(this, ...args);
      this.init();
    } else {
      try {
        this.component = new module.ComponentConstructor(this);
        this.component.load();
      } catch (error) {
        this.handleError(error, `loading component [${this.slug}]`);
      }
    }
  }

  init() {
    try {
      this.component.init();
    } catch (error) {
      this.handleError(error, `initializing component [${this.slug}]`);
    }
  }

  destroy() {
    try {
      this.component.destroy();
    } catch (error) {
      this.handleError(error, `destroying component [${this.slug}]`);
    }
  }

  bindAll() {
    try {
      this.component.bindAll();
    } catch (error) {
      this.handleError(error, `binding component [${this.slug}]`);
    }
  }

  unbindAll() {
    try {
      this.component.unbindAll();
    } catch (error) {
      this.handleError(error, `unbinding component [${this.slug}]`);
    }
  }

  unsubscribeAll() {
    try {
      this.component.unsubscribeAll();
    } catch (error) {
      this.handleError(error, `unsubscribing component [${this.slug}]`);
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

    this.application.handleError(error, message, detail);
  }
}
