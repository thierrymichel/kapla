import { Handler } from '../events';

export class Component extends Handler {
  constructor(context) {
    super(context);
    this.context = context;

    const { props } = this.scope;

    if (props) {
      for (const prop in props) {
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
          if (this[prop]) {
            this.context.handleError(`[${prop}] already exists!`, 'initializing props');
          } else {
            this[prop] = props[prop];
          }
        }
      }
    }
  }

  get scope() {
    return this.context.scope;
  }

  get $el() {
    return this.scope.element;
  }

  get $refs() {
    return this.scope.refs;
  }

  get slug() {
    return this.scope.slug;
  }

  get data() {
    return this.scope.data;
  }

  /* eslint-disable no-empty-function, class-methods-use-this */
  load() {}
  init() {}
  destroy() {}
  /* eslint-enable no-empty-function, class-methods-use-this */
}
