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
    this.plugins = new Set();
  }

  start() {
    this.manager.start();
  }

  stop() {
    this.manager.stop();
  }

  register(slug, ComponentConstructor, ...args) {
    this.manager.addModule({
      slug,
      ComponentConstructor,
    }, false, args);
  }

  load(definitions) {
    const items = Array.isArray(definitions) ? definitions : [definitions];

    items.forEach(def => this.manager.addModule(def));
  }

  init(slug, NoComponentConstructor, ...args) {
    this.manager.addModule({
      slug,
      ComponentConstructor: NoComponentConstructor,
    }, true, args);

    // Return the instance
    return this.components.find(component => component instanceof NoComponentConstructor);
  }

  unload(slugs) {
    const items = Array.isArray(slugs) ? slugs : [slugs];

    items.forEach(slug => this.manager.removeModule(slug));
  }

  /**
   * Get "active" components
   *
   * @returns {Array} components
   * @readonly
   * @memberof Application
   */
  get components() {
    return this.manager.contexts.map(context => context.component);
  }

  /**
   * Get instance by element
   *
   * @param {HTMLElement} el component main element
   * @returns {Object} component instance
   * @memberof Application
   */
  instanceByElement(el) {
    return this._getInstanceByElement(el);
  }

  /**
   * Get instance by element in async mode
   * more reliable implementation with MutationObserver async behaviour
   * use case : when component is added to the page
   * concurrently to the code execution
   * https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
   *
   * @param {HTMLElement} el component main element
   * @returns {Object} component instance
   * @memberof Application
   */
  instanceByElementAsync(el) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this._getInstanceByElement(el));
      });
    });
  }

  _getInstanceByElement(el) {
    return this.components.find(c => c.$el === el);
  }

  /**
   * Get instances by component class
   *
   * @param {Function} Component component class
   * @returns {Object[]} component instances list
   * @memberof Application
   */
  instancesByComponent(Component) {
    return this._getInstanceByComponent(Component);
  }

  /**
   * Get instances by component class in async mode
   * more reliable implementation with MutationObserver async behaviour
   * use case : when component is added to the page
   * concurrently to the code execution
   * https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
   *
   * @param {Function} Component component class
   * @returns {Object[]} component instances list
   * @memberof Application
   */
  instancesByComponentAsync(Component) { // eslint-disable-line id-length
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this._getInstanceByComponent(Component));
      });
    });
  }

  _getInstancesByComponent(Component) {
    return this.components.filter(c => c instanceof Component);
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

  extend(plugin) {
    plugin.init();
    this.plugins.add(plugin);
  }

  // eslint-disable-next-line class-methods-use-this
  handleError(error, message) {
    // DEV
    // console.error('%s\n\n%o\n\n%o', message, error, detail);
    throw new Error(`🤦 ${exclamations.random()}! ${message} \n ${error}`);
  }
}
