import { Context } from './Context';

export class Module {
  constructor(application, definition, args) {
    this.application = application;
    this.definition = definition;
    this.args = args;

    this.contextsByElement = new WeakMap();
    this.contextsByNoElement = new Map();
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

  initElement(element, args) {
    const context = this._fetchContextForElement(element, args);

    if (context && !this.initializedContexts.has(context)) {
      this.initializedContexts.add(context);
      context.init();
      context.bindAll();
    }
  }

  initNoElement(slug, args) {
    const context = this._fetchContextForNoElement(slug, args);

    if (context && !this.initializedContexts.has(context)) {
      this.initializedContexts.add(context);
      context.bindAll();
    }
  }

  destroyElement(element) {
    const context = this._fetchContextForElement(element);

    if (context && this.initializedContexts.has(context)) {
      this.initializedContexts.delete(context);
      context.unbindAll();
      context.unsubscribeAll();
      context.destroy();
    }
  }

  destroyNoElement(slug) {
    const context = this._fetchContextForNoElement(slug);

    if (context && this.initializedContexts.has(context)) {
      this.initializedContexts.delete(context);
      context.unbindAll();
      context.unsubscribeAll();
      context.destroy();
    }
  }

  // Private
  _fetchContextForElement(element, args) {
    let context = this.contextsByElement.get(element);

    if (!context) {
      context = new Context(this, element, args);
      this.contextsByElement.set(element, context);
    }

    return context;
  }

  _fetchContextForNoElement(slug, args) { // eslint-disable-line id-length
    let context = this.contextsByNoElement.get(slug);

    if (!context) {
      context = new Context(this, null, args);
      this.contextsByNoElement.set(slug, context);
    }

    return context;
  }
}
