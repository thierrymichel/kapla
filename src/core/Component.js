import { Handler } from '../events';

export class Component extends Handler {
  constructor(context) {
    super(context);
    this.context = context;
  }

  get scope() {
    return this.context.scope;
  }

  get $element() {
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
