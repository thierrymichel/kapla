import { Context } from './Context';

export class Module {
  constructor(application, definition) {
    this.application = application;
    this.definition = definition;

    this.contextsByElement = new WeakMap();
    this.initializedContexts = new Set();
  }

  get slug() {
    return this.definition.slug;
  }

  get ComponentConstructor() {
    return this.definition.ComponentConstructor;
  }

  get contexts() {
    return Array.from(this.initializedContexts);
  }

  initElement(element) {
    const context = this._fetchContextForElement(element);

    if (context && !this.initializedContexts.has(context)) {
      this.initializedContexts.add(context);
      context.init();
      context.bindAll();
    }
  }

  destroyElement(element) {
    const context = this._fetchContextForElement(element);

    if (context && this.initializedContexts.has(context)) {
      this.initializedContexts.delete(context);
      context.unbindAll();
      context.destroy();
    }
  }

  // Private
  _fetchContextForElement(element) {
    let context = this.contextsByElement.get(element);

    if (!context) {
      context = new Context(this, element);
      this.contextsByElement.set(element, context);
    }

    return context;
  }
}
