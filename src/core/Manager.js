import { Module } from './Module';
import { TokenObserver } from '../observers';

export class Manager {
  constructor(application) {
    this.application = application;
    this.observer = new TokenObserver(this.element, this.componentAttribute, this);
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

  start() {
    this.observer.start();
  }

  stop() {
    this.observer.stop();
  }

  addModule(definition, args = null) {
    const { slug } = definition;

    this.removeModule(slug);

    const module = new Module(this.application, definition);

    this.modulesBySlug.set(slug, module);
    // Init module
    this._initModule(module, args);
  }

  removeModule(slug) {
    const module = this.modulesBySlug.get(slug);

    if (module) {
      this.modulesBySlug.delete(slug);
      // Destroy module
      this._destroyModule(module);
    }
  }

  // Token observer delegate
  elementMatchedToken(element, token) {
    this._initModuleBySlug(token, element);
  }

  elementUnmatchedToken(element, token) {
    this._destroyModuleBySlug(token, element);
  }

  // Contexts
  get contexts() {
    return this.modules.reduce((contexts, module) => contexts.concat(Array.from(module.contexts)), []);
  }

  // Private
  _initModule(module, args) {
    const elements = this.observer.getElementsMatchingToken(module.slug);

    // Args are used only for "no component / mixin" components
    if (args) {
      module.initNoElement(module.slug, args);
    } else {
      for (const element of elements) {
        module.initElement(element);
      }
    }
  }

  _destroyModule(module) { // eslint-disable-line class-methods-use-this
    const { contexts } = module;

    for (const { element } of contexts) {
      module.destroyElement(element);
    }
  }

  _initModuleBySlug(slug, element) {
    const module = this.modulesBySlug.get(slug);

    if (module) {
      module.initElement(element);
    }
  }

  _destroyModuleBySlug(slug, element) {
    const module = this.modulesBySlug.get(slug);

    if (module) {
      module.destroyElement(element);
    }
  }
}
